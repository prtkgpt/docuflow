import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile } from "@/lib/process";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { prisma } from "@/lib/db";
import { checkAiLimit } from "@/lib/quotas";
import { getOpenAI, getModel } from "@/lib/ai/openai";
import { chunkText } from "@/lib/pdf/chunk";
import { retrieveTopK } from "@/lib/ai/retrieval";
import { embedBatch, embedText, rankByCosine } from "@/lib/ai/embeddings";
import { estimateCostUsd, usdToCents, approxCharsForTokens } from "@/lib/ai/cost";
import { aiErrorResponse } from "@/lib/ai/errors";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  fileId: z.string(),
  question: z.string().min(2).max(2000),
});
const SYSTEM = `Answer questions about the user's PDF using only the provided chunks. Cite the chunk numbers you used in square brackets like [Chunk 2]. If the answer isn't in the chunks, say so plainly. Be concise.`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to use AI tools", code: "AUTH_REQUIRED" }, { status: 401 });
  }
  try {
    const { fileId, question } = Body.parse(await req.json());

    // Plan + quota check before extracting / hitting OpenAI.
    const check = await checkAiLimit(userId, "chat");
    if (!check.ok) {
      return NextResponse.json(
        { error: check.message, code: check.code, plan: check.plan, used: check.used, limit: check.limit },
        { status: 402 },
      );
    }

    // Make sure the file's chunks exist; build them once and reuse forever.
    const { file, buffer } = await loadFile(fileId);
    let chunkRows = await prisma.pdfChunk.findMany({
      where: { fileId: file.id },
      orderBy: { index: "asc" },
    });
    if (chunkRows.length === 0) {
      const { text } = await extractPdfText(buffer);
      if (!text || text.trim().length < 30) {
        return NextResponse.json({
          error: "Could not extract text from this PDF. Run OCR first if it's a scan.",
        }, { status: 422 });
      }
      const chunks = chunkText(text);
      if (chunks.length === 0) {
        return NextResponse.json({ error: "PDF has no text we can index." }, { status: 422 });
      }

      // Embed all chunks in one batched OpenAI call. If the embedding
      // service is unavailable we still write the chunks and the chat
      // falls back to keyword retrieval.
      const embeds = await embedBatch(chunks);
      const data = chunks.map((text, index) => ({
        fileId: file.id,
        index,
        text,
        embedding: embeds?.vectors[index] ? JSON.stringify(embeds.vectors[index]) : null,
      }));
      await prisma.pdfChunk.createMany({ data, skipDuplicates: true });
      chunkRows = await prisma.pdfChunk.findMany({
        where: { fileId: file.id },
        orderBy: { index: "asc" },
      });
    }

    // Retrieval: prefer embeddings (semantic) if every chunk has one;
    // otherwise fall back to keyword scoring. Both produce the same
    // top-K shape for the rest of the pipeline.
    type Top = { index: number; text: string };
    let top: Top[] = [];
    const embeddable = chunkRows.every((c) => !!c.embedding);
    if (embeddable) {
      const qEmbed = await embedText(question);
      if (qEmbed) {
        const withVec = chunkRows.map((c) => ({
          index: c.index,
          text: c.text,
          vector: safeParseEmbedding(c.embedding),
        })).filter((c) => c.vector.length > 0);
        const ranked = rankByCosine(withVec, qEmbed.vector, 8);
        top = ranked.map((r) => ({ index: r.item.index, text: r.item.text }));
      }
    }
    if (top.length === 0) {
      top = retrieveTopK(
        chunkRows.map((c) => ({ index: c.index, text: c.text })),
        question,
        8,
      );
    }
    const charBudget = approxCharsForTokens(check.maxInputTokens) - 2000; // reserve for prompt + question
    const selected: { index: number; text: string }[] = [];
    let used = 0;
    for (const c of top) {
      if (used + c.text.length > charBudget) break;
      selected.push({ index: c.index, text: c.text });
      used += c.text.length;
    }
    if (selected.length === 0 && top.length > 0) {
      // Force at least one chunk even if it would slightly exceed the budget.
      selected.push({ index: top[0].index, text: top[0].text.slice(0, charBudget) });
    }

    const context = selected
      .map((c) => `[Chunk ${c.index + 1}]\n${c.text}`)
      .join("\n\n");

    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured", code: "AI_UNAVAILABLE" },
        { status: 503 },
      );
    }

    let completion;
    const model = getModel();
    try {
      completion = await openai.chat.completions.create({
        model,
        max_tokens: check.maxOutputTokens,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Document chunks (${selected.length} of ${chunkRows.length}):\n\n${context}\n\nQuestion: ${question}` },
        ],
        temperature: 0.1,
      });
    } catch (openaiErr) {
      // Don't burn the user's question counter when OpenAI is the one
      // failing. Surface a clean message so the UI can retry.
      const { status, body } = aiErrorResponse(openaiErr);
      console.error("[chat] OpenAI error:", openaiErr);
      return NextResponse.json(body, { status });
    }

    const answer = completion.choices[0]?.message?.content || "";
    // The model cites chunk numbers — surface them as page-equivalent
    // pointers in the response, falling back gracefully when it doesn't.
    const cited = Array.from(new Set(
      Array.from(answer.matchAll(/Chunk\s+(\d+)/gi)).map((m) => parseInt(m[1], 10)),
    ));

    const inputTokens = completion.usage?.prompt_tokens ?? 0;
    const outputTokens = completion.usage?.completion_tokens ?? 0;
    const costUsd = estimateCostUsd(model, inputTokens, outputTokens);

    // Spend a credit if the plan budget is exhausted but the user has
    // pre-purchased chat questions to cover this request.
    if (typeof check.usedCredits === "number" && check.usedCredits > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { chatQuestionsCredits: { decrement: 1 } },
      });
    }

    await prisma.aIRequest.create({
      data: {
        userId,
        fileId: file.id,
        requestType: "chat",
        prompt: question,
        response: answer,
        tokensUsed: inputTokens + outputTokens,
      },
    });

    await prisma.aIUsage.create({
      data: {
        userId,
        fileId: file.id,
        featureType: "chat",
        model: model,
        inputTokens,
        outputTokens,
        estimatedCost: costUsd,
      },
    });

    await incrementPlanUsage(userId, {
      chat: 1,
      inputTokens,
      outputTokens,
      costCents: usdToCents(costUsd),
    });

    await prisma.toolUsage.create({ data: { userId, toolType: "chat", fileId: file.id } });

    return NextResponse.json({
      answer,
      pages: cited,            // we surface cited chunk indices as "pages"
      chunks: selected.length, // how many chunks we actually sent
      total: chunkRows.length, // total chunks in the doc
      usage: { used: check.used + 1, limit: check.limit, credits: check.usedCredits ?? 0 },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Chat failed" }, { status: 400 });
  }
}

async function incrementPlanUsage(userId: string, delta: {
  summaries?: number; chat?: number;
  inputTokens?: number; outputTokens?: number; costCents?: number;
}) {
  const reset = new Date();
  reset.setUTCDate(1);
  reset.setUTCHours(0, 0, 0, 0);
  reset.setUTCMonth(reset.getUTCMonth() + 1);

  const sub = await prisma.subscription.findUnique({ where: { userId } });
  const plan = sub?.plan ?? "free";

  await prisma.planUsage.upsert({
    where: { userId },
    update: {
      plan,
      summariesUsed: { increment: delta.summaries ?? 0 },
      chatQuestionsUsed: { increment: delta.chat ?? 0 },
      inputTokensUsed: { increment: delta.inputTokens ?? 0 },
      outputTokensUsed: { increment: delta.outputTokens ?? 0 },
      estimatedCostMonthCents: { increment: delta.costCents ?? 0 },
    },
    create: {
      userId,
      plan,
      summariesUsed: delta.summaries ?? 0,
      chatQuestionsUsed: delta.chat ?? 0,
      inputTokensUsed: delta.inputTokens ?? 0,
      outputTokensUsed: delta.outputTokens ?? 0,
      estimatedCostMonthCents: delta.costCents ?? 0,
      resetDate: reset,
    },
  });
}

function safeParseEmbedding(s: string | null): number[] {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(Number) : [];
  } catch { return []; }
}
