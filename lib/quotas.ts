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

// Anonymous (no userId) gets the same free limits but we can't track usage
// across sessions. We rely on the per-plan upload size cap to prevent abuse.
export const FREE_DEFAULT_BYTES = PLANS[0].maxUploadMb * 1024 * 1024;

// ---------------------------------------------------------------------------
// AI tool limits (summarize + chat)
// ---------------------------------------------------------------------------

export type AiLimits = {
  // Max characters of extracted PDF text we'll send to the model in one call.
  maxChars: number;
  // Max calls per UTC month, per user, per request type. 0 = not allowed.
  perMonth: number;
};

export function getAiLimits(plan: PlanId, kind: "summarize" | "chat"): AiLimits {
  if (plan === "business") {
    return { maxChars: 1_000_000, perMonth: kind === "chat" ? 100_000 : 5_000 };
  }
  if (plan === "pro") {
    return { maxChars: 500_000, perMonth: kind === "chat" ? 5_000 : 1_000 };
  }
  if (plan === "plus") {
    return { maxChars: 100_000, perMonth: kind === "chat" ? 1_000 : 200 };
  }
  // Free: 3 summaries / month on shorter PDFs. No chat (Plus and up).
  return {
    maxChars: kind === "summarize" ? 8_000 : 0,
    perMonth: kind === "summarize" ? 3 : 0,
  };
}

export type AiCheckResult =
  | { ok: true; used: number; limit: number }
  | {
      ok: false;
      code: "AI_TEXT_TOO_LONG" | "AI_MONTHLY_LIMIT" | "PLAN_REQUIRED";
      message: string;
      plan: PlanId;
      used?: number;
      limit?: number;
      maxChars?: number;
    };

export async function checkAiLimit(
  userId: string,
  kind: "summarize" | "chat",
  textLength: number,
): Promise<AiCheckResult> {
  const quota = await getUserQuota(userId);
  const limits = getAiLimits(quota.plan, kind);

  if (limits.perMonth === 0) {
    return {
      ok: false,
      code: "PLAN_REQUIRED",
      plan: quota.plan,
      message:
        kind === "chat"
          ? "Chat with PDF is included with Kitty Plus ($2.99/mo). Upgrade to start chatting with your PDFs."
          : "AI summaries require a paid plan.",
    };
  }

  if (textLength > limits.maxChars) {
    return {
      ok: false,
      code: "AI_TEXT_TOO_LONG",
      plan: quota.plan,
      maxChars: limits.maxChars,
      message:
        quota.plan === "free"
          ? `This PDF is too long for the Free plan's summarizer (max ${limits.maxChars.toLocaleString()} characters). Upgrade to Kitty Plus ($2.99/mo) for files up to ~80 pages.`
          : `This PDF is too long for your plan's ${kind === "summarize" ? "summarizer" : "chat"}. Upgrade to a higher tier for longer files.`,
    };
  }

  // Monthly counter — count entries in AIRequest table since UTC start of month.
  const since = periodStart("month");
  const used = await prisma.aIRequest.count({
    where: { userId, requestType: kind, createdAt: { gte: since } },
  });

  if (used >= limits.perMonth) {
    return {
      ok: false,
      code: "AI_MONTHLY_LIMIT",
      plan: quota.plan,
      used,
      limit: limits.perMonth,
      message:
        quota.plan === "free"
          ? `You've used your ${limits.perMonth} free ${kind === "summarize" ? "summaries" : "questions"} this month. Upgrade to Kitty Plus for ${kind === "summarize" ? "200 summaries" : "1,000 questions"} every month — only $2.99.`
          : `You've reached this month's ${kind === "summarize" ? "summary" : "chat"} limit on your plan. Upgrade for higher limits.`,
    };
  }

  return { ok: true, used, limit: limits.perMonth };
}

export async function getAiUsageToday(userId: string, kind: "summarize" | "chat") {
  const since = periodStart("month");
  const used = await prisma.aIRequest.count({
    where: { userId, requestType: kind, createdAt: { gte: since } },
  });
  const quota = await getUserQuota(userId);
  const limits = getAiLimits(quota.plan, kind);
  return { plan: quota.plan, used, limit: limits.perMonth, maxChars: limits.maxChars };
}
