import { prisma } from "@/lib/db";
import { PLANS, type PlanId, getPlan } from "@/lib/plans";

export type Quota = {
  plan: PlanId;
  monthlyFiles: number;
  monthlyUsed: number;
  remaining: number;
  maxUploadBytes: number;
  aiAllowed: boolean;
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
    aiAllowed: planId !== "free",
  };
}

// Anonymous (no userId) gets the same free limits but we can't track usage
// across sessions; we lean on the email gate to convert anon → user.
export const FREE_DEFAULT_BYTES = PLANS[0].maxUploadMb * 1024 * 1024;
