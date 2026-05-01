import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.file.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const file = await prisma.file.findUnique({ where: { id: params.id } });
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ file });
}
