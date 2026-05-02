import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { signPdf } from "@/lib/pdf/sign";
import { loadFile, persistOutput } from "@/lib/process";

export const runtime = "nodejs";

const Body = z.object({
  fileId: z.string(),
  page: z.number().int().min(1).default(1),
  signature: z.union([
    z.object({ kind: z.literal("text"), text: z.string().min(1) }),
    z.object({ kind: z.literal("image"), dataUrl: z.string().min(1) }),
  ]),
  placement: z.object({
    x: z.number().default(60),
    y: z.number().default(80),
    width: z.number().default(180),
    height: z.number().default(40),
  }).default({ x: 60, y: 80, width: 180, height: 40 }),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  try {
    const data = Body.parse(await req.json());
    const { buffer } = await loadFile(data.fileId);
    const out = await signPdf(buffer, data.signature, { ...data.placement, page: data.page });
    const result = await persistOutput({
      userId,
      fileId: data.fileId,
      toolType: "sign",
      output: out,
      outputName: `signed-${Date.now()}.pdf`,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Sign failed" }, { status: 400 });
  }
}
