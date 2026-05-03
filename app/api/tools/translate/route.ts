import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile } from "@/lib/process";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { translateText } from "@/lib/pdf/translate";
import { aiErrorResponse } from "@/lib/ai/errors";
import { checkAiLimit } from "@/lib/quotas";
import { prisma } from "@/lib/db";
import { estimateCostUsd, usdToCents } from "@/lib/ai/cost";
import { getModel } from "@/lib/ai/openai";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  fileId: z.string().min(1),
  from: z.string().optional(),
  to: z.string().min(2).max(8),
});

// PDF translation reuses the summarize quota for v1 — both are
// "AI document operation" with similar cost profile (full document
// in, full document out). Track separately later if abuse appears.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to translate", code: "AUTH_REQUIRED" }, { status: 401 });
  }
  try {
    const { fileId, from, to } = Body.parse(await req.json());

    const check = await checkAiLimit(userId, "summarize");
    if (!check.ok) {
      return NextResponse.json(
        { error: check.message, code: check.code, plan: check.plan, used: check.used, limit: check.limit },
        { status: 402 },
      );
    }

    const { file, buffer } = await loadFile(fileId);
    const { text } = await extractPdfText(buffer);
    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: "Could not extract text. Run OCR PDF first if it's a scan." },
        { status: 422 },
      );
    }

    let result;
    try {
      result = await translateText({ text, from, to });
    } catch (e) {
      const { status, body } = aiErrorResponse(e);
      console.error("[translate] OpenAI error", e);
      return NextResponse.json(body, { status });
    }

    const model = getModel();
    const costUsd = estimateCostUsd(model, result.inputTokens, result.outputTokens);

    await prisma.aIRequest.create({
      data: {
        userId,
        fileId: file.id,
        requestType: "summarize",
        prompt: `translate ${result.fromName} → ${result.toName}`,
        response: result.chunks.map((c) => c.translated).join("\n\n").slice(0, 8000),
        tokensUsed: result.inputTokens + result.outputTokens,
      },
    });

    await prisma.aIUsage.create({
      data: {
        userId,
        fileId: file.id,
        featureType: "translate",
        model,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens,
        estimatedCost: costUsd,
      },
    });

    await prisma.toolUsage.create({ data: { userId, toolType: "translate", fileId: file.id } });

    // Roll the cost into PlanUsage for the AI budget dashboard.
    const reset = new Date();
    reset.setUTCDate(1);
    reset.setUTCHours(0, 0, 0, 0);
    reset.setUTCMonth(reset.getUTCMonth() + 1);
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    await prisma.planUsage.upsert({
      where: { userId },
      update: {
        plan: sub?.plan ?? "free",
        summariesUsed: { increment: 1 },
        inputTokensUsed: { increment: result.inputTokens },
        outputTokensUsed: { increment: result.outputTokens },
        estimatedCostMonthCents: { increment: usdToCents(costUsd) },
      },
      create: {
        userId,
        plan: sub?.plan ?? "free",
        summariesUsed: 1,
        inputTokensUsed: result.inputTokens,
        outputTokensUsed: result.outputTokens,
        estimatedCostMonthCents: usdToCents(costUsd),
        resetDate: reset,
      },
    });

    return NextResponse.json({
      from: result.fromCode,
      to: result.toCode,
      fromName: result.fromName,
      toName: result.toName,
      translated: result.chunks.map((c) => c.translated).join("\n\n"),
      pairs: result.chunks,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Translation failed" }, { status: 400 });
  }
}
