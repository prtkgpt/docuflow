import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAiUsageToday } from "@/lib/quotas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only summary the AI tool pages call to render "X of Y used today".
// Returns { plan, used, limit, maxChars } or null if the user isn't signed in.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ signedIn: false });
  const url = new URL(req.url);
  const kind = (url.searchParams.get("kind") === "chat" ? "chat" : "summarize") as "chat" | "summarize";
  const usage = await getAiUsageToday(userId, kind);
  return NextResponse.json({ signedIn: true, ...usage });
}
