import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ADMIN_EMAILS is a comma-separated env var. Add the master admin's email
// in Vercel → Settings → Environment Variables.
function getAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin(): Promise<{ ok: true; email: string } | { ok: false; reason: string }> {
  const session = await getServerSession(authOptions).catch(() => null);
  const email = session?.user?.email?.toLowerCase();
  if (!email) return { ok: false, reason: "Sign in required." };
  const allow = getAllowlist();
  if (allow.length === 0) return { ok: false, reason: "ADMIN_EMAILS env var is not configured." };
  if (!allow.includes(email)) return { ok: false, reason: "This account is not on the admin allowlist." };
  return { ok: true, email };
}

export function isAllowedEmailSync(email: string | undefined | null) {
  if (!email) return false;
  const allow = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.toLowerCase());
}
