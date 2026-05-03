import { prisma } from "@/lib/db";
import { PLANS, type PlanId, getPlan } from "@/lib/plans";

export type Quota = {
  plan: PlanId;
  filesPeriod: "day" | "month";
  filesLimit: number;
  used: number;
  remaining: number;
  maxUploadBytes: number;
};

function periodStart(period: "day" | "month"): Date {
  const since = new Date();
  if (period === "day") {
    since.setUTCHours(0, 0, 0, 0);
  } else {
    since.setUTCDate(1);
    since.setUTCHours(0, 0, 0, 0);
  }
  return since;
}

export async function getUserQuota(userId: string | null): Promise<Quota> {
  let planId: PlanId = "free";
  if (userId) {
    const sub = await prisma.subscription.findUnique({ where: { userId } });
    if (sub?.plan === "plus" || sub?.plan === "pro" || sub?.plan === "business") planId = sub.plan;
  }
  const plan = getPlan(planId);

  let used = 0;
  if (userId) {
    const since = periodStart(plan.filesPeriod);
    used = await prisma.toolUsage.count({
      where: { userId, createdAt: { gte: since } },
    });
  }

  return {
    plan: planId,
    filesPeriod: plan.filesPeriod,
    filesLimit: plan.filesLimit,
    used,
    remaining: Math.max(0, plan.filesLimit - used),
    maxUploadBytes: plan.maxUploadMb * 1024 * 1024,
  };
}

export const FREE_DEFAULT_BYTES = PLANS[0].maxUploadMb * 1024 * 1024;

// ---------------------------------------------------------------------------
// AI tool limits — separate counters for summary and chat, plus per-call
// input/output token caps. Counters reset at UTC start of month.
// ---------------------------------------------------------------------------

export type AiPlanLimits = {
  perMonth: number;            // calls / month
  maxInputTokens: number;      // cap on text we send to the model in a call
  maxOutputTokens: number;     // cap on the model's response (max_tokens)
};

export function getAiLimits(plan: PlanId, kind: "summarize" | "chat"): AiPlanLimits {
  const p = getPlan(plan);
  const perMonth = kind === "summarize" ? p.ai.summariesPerMonth : p.ai.chatPerMonth;
  return {
    perMonth,
    maxInputTokens: p.ai.maxInputTokensPerDoc,
    maxOutputTokens: p.ai.maxOutputTokensPerAnswer,
  };
}

export type AiCheckResult =
  | { ok: true; used: number; limit: number; maxInputTokens: number; maxOutputTokens: number; usedCredits?: number }
  | {
      ok: false;
      code: "AI_DISABLED" | "AI_MONTHLY_LIMIT" | "PLAN_REQUIRED";
      message: string;
      plan: PlanId;
      used?: number;
      limit?: number;
    };

// Check whether a user can spend a chat-question or summary right now.
// Order of checks:
//   1. Plan disables this AI feature entirely (perMonth = 0) → AI_DISABLED.
//   2. Plan budget exhausted AND no credit pack questions left → MONTHLY_LIMIT.
// Pre-purchased AI credit pack questions roll over and are decremented after
// the plan budget; they're stored on User.chatQuestionsCredits (created by
// schema migration in this commit).
export async function checkAiLimit(
  userId: string,
  kind: "summarize" | "chat",
): Promise<AiCheckResult> {
  const quota = await getUserQuota(userId);
  const limits = getAiLimits(quota.plan, kind);

  if (limits.perMonth === 0) {
    return {
      ok: false,
      code: "AI_DISABLED",
      plan: quota.plan,
      message:
        kind === "chat"
          ? "Chat with PDF requires Kitty Plus ($2.99/mo) or higher. Upgrade to start chatting with your PDFs."
          : "AI summaries require a paid plan.",
    };
  }

  const since = periodStart("month");
  const used = await prisma.aIRequest.count({
    where: { userId, requestType: kind, createdAt: { gte: since } },
  });

  if (used < limits.perMonth) {
    return {
      ok: true,
      used,
      limit: limits.perMonth,
      maxInputTokens: limits.maxInputTokens,
      maxOutputTokens: limits.maxOutputTokens,
    };
  }

  // Plan budget hit. For chat questions, allow purchased credits to cover
  // the call. Summaries are not credit-pack-backed in v1.
  if (kind === "chat") {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { chatQuestionsCredits: true },
    });
    if (user && user.chatQuestionsCredits > 0) {
      return {
        ok: true,
        used,
        limit: limits.perMonth,
        maxInputTokens: limits.maxInputTokens,
        maxOutputTokens: limits.maxOutputTokens,
        usedCredits: user.chatQuestionsCredits,
      };
    }
  }

  return {
    ok: false,
    code: "AI_MONTHLY_LIMIT",
    plan: quota.plan,
    used,
    limit: limits.perMonth,
    message:
      quota.plan === "free"
        ? `You've used your ${limits.perMonth} free ${kind === "summarize" ? "summary" : "chat questions"} for this month. Upgrade to Kitty Plus ($2.99/mo) for ${kind === "summarize" ? "25 summaries" : "100 questions"} per month — or add an AI credit pack from $5.`
        : `You've reached this month's ${kind === "summarize" ? "summary" : "chat"} limit on your plan. ${kind === "chat" ? "Add an AI credit pack from $5 or upgrade." : "Upgrade for more summaries."}`,
  };
}

// UI helper — current month usage + plan caps + reset date for the
// /api/ai-usage endpoint.
export async function getAiUsageThisMonth(userId: string) {
  const since = periodStart("month");
  const [summariesUsed, chatUsed, user, quota] = await Promise.all([
    prisma.aIRequest.count({ where: { userId, requestType: "summarize", createdAt: { gte: since } } }),
    prisma.aIRequest.count({ where: { userId, requestType: "chat", createdAt: { gte: since } } }),
    prisma.user.findUnique({ where: { id: userId }, select: { chatQuestionsCredits: true } }),
    getUserQuota(userId),
  ]);
  const plan = getPlan(quota.plan);
  // First of next month UTC
  const reset = new Date(since);
  reset.setUTCMonth(reset.getUTCMonth() + 1);
  return {
    plan: quota.plan,
    summariesUsed,
    summariesLimit: plan.ai.summariesPerMonth,
    chatUsed,
    chatLimit: plan.ai.chatPerMonth,
    chatCredits: user?.chatQuestionsCredits ?? 0,
    resetDate: reset.toISOString(),
  };
}
