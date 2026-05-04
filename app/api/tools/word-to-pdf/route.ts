import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile, persistOutput } from "@/lib/process";
import { wordToPdf } from "@/lib/pdf/word-to-pdf";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ fileId: z.string().min(1) });

const ALLOWED_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId } = Body.parse(await req.json());
    const { file, buffer } = await loadFile(fileId, userId);
    if (!ALLOWED_TYPES.has(file.mimeType) && !/\.docx?$/i.test(file.originalName)) {
      return NextResponse.json(
        { error: `"${file.originalName}" doesn't look like a Word document. Please upload a .doc or .docx file.` },
        { status: 400 },
      );
    }
    const out = await wordToPdf(buffer);
    const baseName = file.originalName.replace(/\.[^.]+$/, "");
    const result = await persistOutput({
      userId,
      fileId,
      toolType: "word-to-pdf",
      output: out,
      outputName: `${baseName}.pdf`,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Conversion failed" }, { status: 400 });
  }
}
