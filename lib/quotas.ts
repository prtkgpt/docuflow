import { prisma } from "@/lib/db";
import { PLANS, type PlanId, getPlan } from "@/lib/plans";

export type Quota = {
  plan: PlanId;
  monthlyFiles: number;
  monthlyUsed: number;
  remaining: number;
  maxUploadBytes: number;
};

export async function getUserQuota(userId: string | null): Promise<Quota> {
  let planId: PlanId = "free";
  if (userId) {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (sub?.plan === "pro" || sub?.plan === "business") planId = sub.plan;
  }
  const plan = getPlan(planId);

  let monthlyUsed = 0;
  if (userId) {
    const since = new Date();
    since.setDate(1);
    since.setHours(0, 0, 0, 0);
    monthlyUsed = await prisma.toolUsage.count({
      where: { userId, createdAt: { gte: since } },
    });
  }

  return {
    plan: planId,
    monthlyFiles: plan.monthlyFiles,
    monthlyUsed,
    remaining: Math.max(0, plan.monthlyFiles - monthlyUsed),
    maxUploadBytes: plan.maxUploadMb * 1024 * 1024,
  };
}

// Anonymous (no userId) gets the same free limits but we can't track usage
// across sessions; we lean on the email gate to convert anon → user.
export const FREE_DEFAULT_BYTES = PLANS[0].maxUploadMb * 1024 * 1024;

// ---------------------------------------------------------------------------
// AI tool limits (summarize + chat)
// ---------------------------------------------------------------------------

// Approx text-length cap per request (in characters). Free users still get
// access to AI tools, just with smaller documents and fewer requests/day.
// Pro/Business raise both substantially.
export type AiLimits = {
  // Max characters of extracted PDF text we'll send to the model in one call.
  maxChars: number;
  // Max calls per UTC day, per user, per request type.
  perDay: number;
};

export function getAiLimits(plan: PlanId, kind: "summarize" | "chat"): AiLimits {
  if (plan === "business") {
    return { maxChars: 1_000_000, perDay: kind === "chat" ? 10_000 : 1_000 };
  }
  if (plan === "pro") {
    return { maxChars: 200_000, perDay: kind === "chat" ? 500 : 100 };
  }
  // free
  return {
    maxChars: kind === "summarize" ? 8_000 : 6_000,
    perDay: kind === "chat" ? 10 : 3,
  };
}

export type AiCheckResult =
  | { ok: true; used: number; limit: number }
  | {
      ok: false;
      code: "AI_TEXT_TOO_LONG" | "AI_DAILY_LIMIT";
      message: string;
      plan: PlanId;
      used?: number;
      limit?: number;
      maxChars?: number;
    };

// Verify a free/pro user can run an AI request right now. Pass the extracted
// PDF text length so we can early-reject huge documents on the free tier.
export async function checkAiLimit(
  userId: string,
  kind: "summarize" | "chat",
  textLength: number,
): Promise<AiCheckResult> {
  const quota = await getUserQuota(userId);
  const limits = getAiLimits(quota.plan, kind);

  if (textLength > limits.maxChars) {
    return {
      ok: false,
      code: "AI_TEXT_TOO_LONG",
      plan: quota.plan,
      maxChars: limits.maxChars,
      message:
        quota.plan === "free"
          ? `This PDF is too long for the Free plan's ${kind === "summarize" ? "summarizer" : "chat"} (limit: ${limits.maxChars.toLocaleString()} characters of text). Upgrade to Pro for files up to ~80–100 pages.`
          : `This PDF is too long for your plan's ${kind === "summarize" ? "summarizer" : "chat"}. Upgrade to Business for unlimited length.`,
    };
  }

  // Daily counter — count entries in AIRequest table since UTC midnight.
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const used = await prisma.aIRequest.count({
    where: { userId, requestType: kind, createdAt: { gte: since } },
  });

  if (used >= limits.perDay) {
    return {
      ok: false,
      code: "AI_DAILY_LIMIT",
      plan: quota.plan,
      used,
      limit: limits.perDay,
      message:
        quota.plan === "free"
          ? `You've used your ${limits.perDay} free ${kind === "summarize" ? "summaries" : "questions"} today. Come back tomorrow or upgrade to Pro for ${kind === "summarize" ? "100/day" : "500/day"}.`
          : `You've reached today's limit of ${limits.perDay}. Upgrade to Business for unlimited.`,
    };
  }

  return { ok: true, used, limit: limits.perDay };
}

// Lightweight read-only summary used by the UI to show "X / Y used today".
export async function getAiUsageToday(userId: string, kind: "summarize" | "chat") {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const used = await prisma.aIRequest.count({
    where: { userId, requestType: kind, createdAt: { gte: since } },
  });
  const quota = await getUserQuota(userId);
  const limits = getAiLimits(quota.plan, kind);
  return { plan: quota.plan, used, limit: limits.perDay, maxChars: limits.maxChars };
}
