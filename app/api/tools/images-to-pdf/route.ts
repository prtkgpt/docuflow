import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile, persistOutput } from "@/lib/process";
import { imagesToPdf } from "@/lib/pdf/images-to-pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ fileIds: z.array(z.string().min(1)).min(1) });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileIds } = Body.parse(await req.json());
    const images: { buffer: Buffer; mimeType: string }[] = [];
    for (const id of fileIds) {
      const { file, buffer } = await loadFile(id, userId);
      if (!file.mimeType.startsWith("image/")) {
        return NextResponse.json({ error: `File "${file.originalName}" is not an image.` }, { status: 400 });
      }
      images.push({ buffer, mimeType: file.mimeType });
    }
    const out = await imagesToPdf(images);
    const result = await persistOutput({
      userId,
      fileId: fileIds[0],
      toolType: "images-to-pdf",
      output: out,
      outputName: `images-${Date.now()}.pdf`,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Conversion failed" }, { status: 400 });
  }
}
