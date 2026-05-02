import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile, persistOutput } from "@/lib/process";
import { bakeAnnotations } from "@/lib/pdf/edit";
import type { Annotation } from "@/lib/pdf/annotations";
import type { PageOps } from "@/lib/pdf/page-ops";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  fileId: z.string().min(1),
  annotations: z.array(z.any()).default([]),
  pageOps: z
    .object({
      keep: z.array(z.number().int().positive()).optional(),
      rotate: z.record(z.string(), z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)])).optional(),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId, annotations, pageOps } = Body.parse(await req.json());
    const { buffer } = await loadFile(fileId);

    // Normalize the rotate map keys back to numbers
    let normalizedOps: PageOps | undefined;
    if (pageOps) {
      normalizedOps = { keep: pageOps.keep };
      if (pageOps.rotate) {
        normalizedOps.rotate = Object.fromEntries(
          Object.entries(pageOps.rotate).map(([k, v]) => [parseInt(k, 10), v]),
        ) as Record<number, 0 | 90 | 180 | 270>;
      }
    }

    const out = await bakeAnnotations(buffer, annotations as Annotation[], normalizedOps);
    const result = await persistOutput({
      userId,
      fileId,
      toolType: "edit",
      output: out,
      outputName: `edited-${Date.now()}.pdf`,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Edit failed" }, { status: 400 });
  }
}
