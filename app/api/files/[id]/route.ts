import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Pre-fix, both GET and DELETE accepted any cuid and returned/deleted
// the matching file regardless of ownership. cuids are not unguessable
// authentication tokens — they're predictable enough that iteration
// could enumerate or destroy any user's files.
//
// Both methods now require auth and verify ownership before acting.

async function loadOwned(id: string, userId: string) {
  return prisma.file.findFirst({ where: { id, userId } });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const file = await loadOwned(params.id, userId);
  // Same 404 whether the file doesn't exist OR isn't yours — so we don't
  // leak existence to an unrelated user.
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ file });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const file = await loadOwned(params.id, userId);
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.file.delete({ where: { id: file.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
