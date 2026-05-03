import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const Patch = z.object({
  name: z.string().max(120).optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  try {
    const data = Patch.parse(await req.json());
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name?.trim() || null },
    });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Invalid update" }, { status: 400 });
  }
}
