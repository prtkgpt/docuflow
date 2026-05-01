import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile } from "@/lib/process";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { summarizeText } from "@/lib/ai/summarize";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ fileId: z.string() });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId } = Body.parse(await req.json());
    const { file, buffer } = await loadFile(fileId);
    const { text } = await extractPdfText(buffer);
    if (!text || text.trim().length < 30) {
      return NextResponse.json({
        error: "Could not extract text. The PDF may be a scan — try OCR PDF first.",
      }, { status: 422 });
    }
    const summary = await summarizeText(text);

    await prisma.aIRequest.create({
      data: {
        userId,
        fileId: file.id,
        requestType: "summarize",
        prompt: text.slice(0, 4000),
        response: JSON.stringify(summary),
        tokensUsed: 0,
      },
    });
    await prisma.toolUsage.create({ data: { userId, toolType: "summarize", fileId: file.id } });

    return NextResponse.json({ summary });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Summarize failed" }, { status: 400 });
  }
}
