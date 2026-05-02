import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { loadFile } from "@/lib/process";
import { extractPdfText } from "@/lib/pdf/extract-text";
import { chatWithDocument } from "@/lib/ai/summarize";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const maxDuration = 60;

const Body = z.object({ fileId: z.string(), question: z.string().min(2) });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId, question } = Body.parse(await req.json());
    const { file, buffer } = await loadFile(fileId);
    const { pageTexts } = await extractPdfText(buffer);
    const { answer, pages } = await chatWithDocument(pageTexts, question);

    await prisma.aIRequest.create({
      data: {
        userId,
        fileId: file.id,
        requestType: "chat",
        prompt: question,
        response: answer,
        tokensUsed: 0,
      },
    });
    await prisma.toolUsage.create({ data: { userId, toolType: "chat", fileId: file.id } });

    return NextResponse.json({ answer, pages });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Chat failed" }, { status: 400 });
  }
}
