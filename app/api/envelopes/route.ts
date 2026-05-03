import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkEnvelopeQuota } from "@/lib/envelopes/quota";
import { newSigningToken } from "@/lib/envelopes/tokens";

export const runtime = "nodejs";

const Recipient = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email(),
  order: z.number().int().min(1).max(20).default(1),
});

const CreateBody = z.object({
  sourceFileId: z.string().min(1),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().max(2000).optional(),
  recipients: z.array(Recipient).min(1).max(10),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const data = CreateBody.parse(await req.json());

    const quota = await checkEnvelopeQuota(userId);
    if (!quota.ok) {
      return NextResponse.json(
        { error: quota.message, code: "ENVELOPE_LIMIT", quota: quota.quota },
        { status: 402 },
      );
    }

    const file = await prisma.file.findFirst({ where: { id: data.sourceFileId, userId } });
    if (!file) return NextResponse.json({ error: "Source file not found" }, { status: 404 });

    const envelope = await prisma.envelope.create({
      data: {
        userId,
        sourceFileId: data.sourceFileId,
        subject: data.subject,
        message: data.message,
        status: "draft",
        recipients: {
          create: data.recipients.map((r) => ({
            name: r.name,
            email: r.email.toLowerCase().trim(),
            order: r.order,
            signingToken: newSigningToken(),
          })),
        },
        events: { create: { type: "created" } },
      },
      include: { recipients: true },
    });

    return NextResponse.json({ id: envelope.id, recipients: envelope.recipients });
  } catch (e: any) {
    const msg = e?.errors?.[0]?.message ?? e?.message ?? "Could not create envelope";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const envelopes = await prisma.envelope.findMany({
    where: { userId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      recipients: { select: { id: true, name: true, email: true, status: true, signedAt: true } },
    },
    take: 100,
  });
  return NextResponse.json({ envelopes });
}
