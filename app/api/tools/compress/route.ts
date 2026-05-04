import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PDFDocument } from "pdf-lib";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { toUint8 } from "@/lib/bytes";
import { loadFile, persistOutput } from "@/lib/process";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ fileId: z.string().min(1) });

// Lightweight compression: re-saves the PDF through pdf-lib with object
// streams + deflate. Real image down-sampling would need a native worker;
// for now we honestly surface both sizes to the user and never lie about
// the savings.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId } = Body.parse(await req.json());
    const { file, buffer } = await loadFile(fileId, userId);
    const doc = await PDFDocument.load(toUint8(buffer), { ignoreEncryption: true });
    const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
    const baseName = file.originalName.replace(/\.[^.]+$/, "");
    const result = await persistOutput({
      userId,
      fileId,
      toolType: "compress",
      output: out,
      outputName: `${baseName}-compressed.pdf`,
    });
    return NextResponse.json({ ...result, originalSize: file.size });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Compression failed" }, { status: 400 });
  }
}
