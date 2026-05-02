import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deletePages } from "@/lib/pdf/delete-pages";
import { loadFile, persistOutput } from "@/lib/process";

export const runtime = "nodejs";

const Body = z.object({ fileId: z.string(), ranges: z.string().min(1) });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileId, ranges } = Body.parse(await req.json());
    const { buffer } = await loadFile(fileId);
    const out = await deletePages(buffer, ranges);
    const result = await persistOutput({
      userId,
      fileId,
      toolType: "delete-pages",
      output: out,
      outputName: `trimmed-${Date.now()}.pdf`,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Delete pages failed" }, { status: 400 });
  }
}
