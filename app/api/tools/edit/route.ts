import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile, persistOutput } from "@/lib/process";
import { bakeAnnotations } from "@/lib/pdf/edit";
import type { Annotation } from "@/lib/pdf/annotations";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({
  fileId: z.string().min(1),
  annotations: z.array(z.any()),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId, annotations } = Body.parse(await req.json());
    const { buffer } = await loadFile(fileId);
    const out = await bakeAnnotations(buffer, annotations as Annotation[]);
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
