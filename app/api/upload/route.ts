import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveBuffer } from "@/lib/storage";
import { getUserQuota, FREE_DEFAULT_BYTES } from "@/lib/quotas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HARD_MAX = 100 * 1024 * 1024;

const ALLOWED = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/jpeg",
  "image/png",
]);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size === 0) return NextResponse.json({ error: "Empty file" }, { status: 400 });
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json({ error: `Unsupported type: ${file.type}` }, { status: 415 });
  }

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  // Per-plan size limit. Anonymous uploads use the Free tier's cap so people
  // who never sign in can't bypass it.
  const quota = userId ? await getUserQuota(userId) : null;
  const sizeLimit = Math.min(HARD_MAX, quota?.maxUploadBytes ?? FREE_DEFAULT_BYTES);
  if (file.size > sizeLimit) {
    return NextResponse.json(
      {
        error: `File exceeds your plan limit (${Math.round(sizeLimit / (1024 * 1024))} MB).`,
        code: "PLAN_LIMIT_SIZE",
        plan: quota?.plan ?? "free",
      },
      { status: 413 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await saveBuffer(buffer, file.name, file.type || "application/pdf");

  const meta = z.object({
    originalName: z.string(),
    storedName: z.string(),
    mimeType: z.string(),
    size: z.number().int().positive(),
    url: z.string(),
  }).parse({
    originalName: file.name,
    storedName: stored.storedName,
    mimeType: file.type || "application/pdf",
    size: stored.size,
    url: stored.url,
  });

  const record = await prisma.file.create({
    data: { ...meta, userId, status: "ready" },
  });

  return NextResponse.json({ id: record.id, url: record.url, name: record.originalName, size: record.size });
}
