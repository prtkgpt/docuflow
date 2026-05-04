import { NextRequest } from "next/server";

// Lightweight in-memory rate limiter.
//
// Trade-off: this lives in module scope, so each Vercel serverless instance
// has its own counter. An attacker hitting cold starts hard could exceed
// per-instance limits temporarily. Good enough to stop casual abuse and
// to prevent obviously runaway loops on a single warm instance — but for
// hard guarantees, swap to Upstash Redis (drop-in once we hit real abuse).
//
// Use case: abuse / cost defenses, not security boundaries. Auth checks
// must still gate sensitive routes; this is just a bound on how loud
// any one client can be.

type Bucket = { count: number; resetAt: number };
const BUCKETS = new Map<string, Bucket>();

// Tidy old buckets occasionally so we don't grow forever in a long-lived
// instance. Cheap because the Map rarely exceeds a few hundred entries.
function maybeGc(now: number) {
  if (BUCKETS.size < 1000) return;
  for (const [k, v] of BUCKETS) {
    if (v.resetAt < now) BUCKETS.delete(k);
  }
}

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export type RateResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

// Allow `limit` requests per `windowMs` per `key`. Returns ok=false when
// the caller has exceeded the cap. Caller writes a 429 with the resetAt.
export function rateLimit(key: string, limit: number, windowMs: number): RateResult {
  const now = Date.now();
  maybeGc(now);
  const existing = BUCKETS.get(key);

  if (!existing || existing.resetAt < now) {
    const fresh = { count: 1, resetAt: now + windowMs };
    BUCKETS.set(key, fresh);
    return { ok: true, remaining: limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count++;
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

// Helper for routes that want a one-liner.
export function checkRateLimit(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number,
): RateResult {
  return rateLimit(`${scope}:${clientIp(req)}`, limit, windowMs);
}
