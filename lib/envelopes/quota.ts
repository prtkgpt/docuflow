import { prisma } from "@/lib/db";
import { type PlanId } from "@/lib/plans";
import { getUserQuota } from "@/lib/quotas";

// Per-plan monthly envelope cap. Free is intentionally generous so the
// feature has real word-of-mouth value; paid plans get more headroom.
export const ENVELOPE_LIMITS: Record<PlanId, number> = {
  free: 10,
  plus: 50,
  pro: 200,
  business: 1000,
};

export type EnvelopeQuota = {
  plan: PlanId;
  used: number;
  limit: number;
  remaining: number;
  resetDate: string;
};

function monthStart(): Date {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function nextMonthStart(): Date {
  const d = monthStart();
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

export async function getEnvelopeQuota(userId: string): Promise<EnvelopeQuota> {
  const quota = await getUserQuota(userId);
  const since = monthStart();
  const used = await prisma.envelope.count({
    where: { userId, createdAt: { gte: since }, deletedAt: null },
  });
  const limit = ENVELOPE_LIMITS[quota.plan];
  return {
    plan: quota.plan,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    resetDate: nextMonthStart().toISOString(),
  };
}

export async function checkEnvelopeQuota(userId: string): Promise<
  { ok: true; quota: EnvelopeQuota } | { ok: false; quota: EnvelopeQuota; message: string }
> {
  const quota = await getEnvelopeQuota(userId);
  if (quota.remaining > 0) return { ok: true, quota };
  return {
    ok: false,
    quota,
    message:
      quota.plan === "free"
        ? `You've used your ${quota.limit} free signature requests this month. Upgrade to Kitty Plus for ${ENVELOPE_LIMITS.plus} per month — or wait until next month.`
        : `You've reached this month's signature-request limit. Upgrade for more.`,
  };
}
