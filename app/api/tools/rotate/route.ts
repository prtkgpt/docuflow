import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { rotatePdf } from "@/lib/pdf/rotate";
import { loadFile, persistOutput } from "@/lib/process";

export const runtime = "nodejs";

const Body = z.object({
  fileId: z.string(),
  ranges: z.string().default(""),
  angle: z.union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)]),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId, ranges, angle } = Body.parse(await req.json());
    const { buffer } = await loadFile(fileId, userId);
    const isCompressPlaceholder = angle === 0;
    const out = isCompressPlaceholder
      ? new Uint8Array(buffer)
      : await rotatePdf(buffer, ranges, angle as 90 | 180 | 270);
    const result = await persistOutput({
      userId,
      fileId,
      toolType: isCompressPlaceholder ? "compress" : "rotate",
      output: out,
      outputName: isCompressPlaceholder ? `optimized-${Date.now()}.pdf` : `rotated-${Date.now()}.pdf`,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Rotate failed" }, { status: 400 });
  }
}
