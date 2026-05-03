import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAiUsageThisMonth } from "@/lib/quotas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only summary the AI tool pages call to render usage counters.
// Returns the user's monthly summary and chat usage + limits + credits +
// reset date, or { signedIn: false } when there's no session.
export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ signedIn: false });
  const usage = await getAiUsageThisMonth(userId);
  return NextResponse.json({ signedIn: true, ...usage });
}
