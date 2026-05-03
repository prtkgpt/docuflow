import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile, persistOutput } from "@/lib/process";
import { pdfToExcel } from "@/lib/pdf/to-excel";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ fileId: z.string().min(1) });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId } = Body.parse(await req.json());
    const { file, buffer } = await loadFile(fileId);
    const out = await pdfToExcel(buffer);
    const baseName = file.originalName.replace(/\.[^.]+$/, "");
    const result = await persistOutput({
      userId,
      fileId,
      toolType: "pdf-to-excel",
      output: out,
      outputName: `${baseName}.xlsx`,
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Conversion failed" }, { status: 400 });
  }
}
