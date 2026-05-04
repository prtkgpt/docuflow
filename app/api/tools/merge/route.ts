import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { mergePdfs } from "@/lib/pdf/merge";
import { loadFile, persistOutput } from "@/lib/process";

export const runtime = "nodejs";

const Body = z.object({ fileIds: z.array(z.string().min(1)).min(2) });

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const { fileIds } = Body.parse(await req.json());
    const buffers: Buffer[] = [];
    for (const id of fileIds) {
      const { buffer } = await loadFile(id, userId);
      buffers.push(buffer);
    }
    const out = await mergePdfs(buffers);
    const result = await persistOutput({
      userId,
      fileId: fileIds[0],
      toolType: "merge",
      output: out,
      outputName: `merged-${Date.now()}.pdf`,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Merge failed" }, { status: 400 });
  }
}
