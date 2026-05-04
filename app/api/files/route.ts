import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Returns metadata for the caller's files only. Pre-fix, this returned
// 50 most-recent files across the whole site — a serious data leak.
// Now scoped to userId and never returns rows owned by anyone else.
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    // Ownership check — findFirst with userId, never findUnique by id alone.
    const file = await prisma.file.findFirst({ where: { id, userId } });
    if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ file });
  }

  const files = await prisma.file.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ files });
}
