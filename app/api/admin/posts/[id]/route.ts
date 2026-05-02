import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Patch = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  body: z.string().optional(),
  answer: z.string().optional(),
  primaryToolHref: z.string().optional(),
  primaryToolLabel: z.string().optional(),
  relatedToolSlugs: z.string().optional(),
  faqJson: z.string().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: 401 });
  try {
    const data = Patch.parse(await req.json());
    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const wasPublished = existing.published;
    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...data,
        publishedAt:
          data.published === true && !wasPublished
            ? new Date()
            : data.published === false
              ? null
              : existing.publishedAt,
      },
    });
    return NextResponse.json({ post });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Invalid update" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: 401 });
  await prisma.blogPost.delete({ where: { id: params.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
