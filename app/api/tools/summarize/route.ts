import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile } from "@/lib/process";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { prisma } from "@/lib/db";
import { checkAiLimit } from "@/lib/quotas";
import { getOpenAI } from "@/lib/ai/openai";
import { estimateCostUsd, truncateToTokens, usdToCents } from "@/lib/ai/cost";
import { aiErrorResponse } from "@/lib/ai/errors";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  fileId: z.string(),
  // Default behaviour reuses the cached summary; pass fresh=true to bypass
  // the cache and rebill OpenAI for a new run.
  fresh: z.boolean().optional(),
});

const MODEL = "gpt-4o-mini";
const SYSTEM = `You are an assistant that summarizes documents.
Return JSON with keys: short, bullets, takeaways, actions.
- short: 2-3 sentence executive summary
- bullets: 3-7 bullet points covering core content
- takeaways: 3-5 key insights
- actions: 0-5 concrete next-step action items (empty array if none)
Respond with JSON only.`;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId) {
    return NextResponse.json(
      { error: "Sign in to use AI tools", code: "AUTH_REQUIRED" },
      { status: 401 },
    );
  }

  try {
    const { fileId, fresh } = Body.parse(await req.json());

    // 1. Cache hit? Return without calling the model — saves OpenAI cost
    //    and doesn't burn the user's monthly summary quota.
    if (!fresh) {
      const cached = await prisma.pdfSummary.findUnique({ where: { fileId } });
      if (cached) {
        await prisma.toolUsage.create({
          data: { userId, toolType: "summarize", fileId },
        });
        return NextResponse.json({
          summary: {
            short: cached.short,
            bullets: safeParseList(cached.bullets),
            takeaways: safeParseList(cached.takeaways),
            actions: safeParseList(cached.actions),
          },
          cached: true,
        });
      }
    }

    // 2. Plan check before extracting (cheap to fail fast).
    const check = await checkAiLimit(userId, "summarize");
    if (!check.ok) {
      return NextResponse.json(
        { error: check.message, code: check.code, plan: check.plan, used: check.used, limit: check.limit },
        { status: 402 },
      );
    }

    const { file, buffer } = await loadFile(fileId);
    const { text } = await extractPdfText(buffer);
    if (!text || text.trim().length < 30) {
      return NextResponse.json({
        error: "Could not extract text. The PDF may be a scan — try OCR PDF first.",
      }, { status: 422 });
    }

    const trimmed = truncateToTokens(text, check.maxInputTokens);

    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        { error: "OpenAI API key not configured", code: "AI_UNAVAILABLE" },
        { status: 503 },
      );
    }

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: MODEL,
        response_format: { type: "json_object" },
        max_tokens: check.maxOutputTokens,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: trimmed },
        ],
        temperature: 0.2,
      });
    } catch (openaiErr) {
      // Map provider errors (quota, rate limit, auth) to friendly responses
      // and bail BEFORE we increment the user's monthly counter — we don't
      // want to "use up" their quota when our provider is the one failing.
      const { status, body } = aiErrorResponse(openaiErr);
      console.error("[summarize] OpenAI error:", openaiErr);
      return NextResponse.json(body, { status });
    }

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);
    const summary = {
      short: typeof parsed.short === "string" ? parsed.short : "",
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets.map(String) : [],
      takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways.map(String) : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions.map(String) : [],
    };

    const inputTokens = completion.usage?.prompt_tokens ?? 0;
    const outputTokens = completion.usage?.completion_tokens ?? 0;
    const costUsd = estimateCostUsd(MODEL, inputTokens, outputTokens);

    // 3. Persist cache + ledger entries.
    await prisma.pdfSummary.upsert({
      where: { fileId },
      update: {
        short: summary.short,
        bullets: JSON.stringify(summary.bullets),
        takeaways: JSON.stringify(summary.takeaways),
        actions: JSON.stringify(summary.actions),
        model: MODEL,
        inputTokens,
        outputTokens,
        estimatedCost: costUsd,
      },
      create: {
        fileId,
        short: summary.short,
        bullets: JSON.stringify(summary.bullets),
        takeaways: JSON.stringify(summary.takeaways),
        actions: JSON.stringify(summary.actions),
        model: MODEL,
        inputTokens,
        outputTokens,
        estimatedCost: costUsd,
      },
    });

    await prisma.aIRequest.create({
      data: {
        userId,
        fileId: file.id,
        requestType: "summarize",
        prompt: trimmed.slice(0, 4000),
        response: JSON.stringify(summary),
        tokensUsed: inputTokens + outputTokens,
      },
    });

    await prisma.aIUsage.create({
      data: {
        userId,
        fileId: file.id,
        featureType: "summarize",
        model: MODEL,
        inputTokens,
        outputTokens,
        estimatedCost: costUsd,
      },
    });

    await incrementPlanUsage(userId, {
      summaries: 1,
      inputTokens,
      outputTokens,
      costCents: usdToCents(costUsd),
    });

    await prisma.toolUsage.create({ data: { userId, toolType: "summarize", fileId: file.id } });

    return NextResponse.json({
      summary,
      cached: false,
      usage: { used: check.used + 1, limit: check.limit },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Summarize failed" }, { status: 400 });
  }
}

function safeParseList(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.map(String) : [];
  } catch { return []; }
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
