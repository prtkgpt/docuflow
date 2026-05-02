import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and dashes only"),
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string().default("PDF editing"),
  body: z.string().min(20),
  answer: z.string().optional(),
  primaryToolHref: z.string().optional(),
  primaryToolLabel: z.string().optional(),
  relatedToolSlugs: z.string().optional(),
  faqJson: z.string().optional(),
  published: z.boolean().default(false),
});

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: 401 });
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: 401 });
  try {
    const data = Body.parse(await req.json());
    const created = await prisma.blogPost.create({
      data: {
        ...data,
        publishedAt: data.published ? new Date() : null,
        authorEmail: auth.email,
      },
    });
    return NextResponse.json({ post: created });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Invalid post data" }, { status: 400 });
  }
}
