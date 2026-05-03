import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const Field = z.object({
  recipientId: z.string().min(1),
  type: z.enum(["signature", "initials", "date", "text", "checkbox"]),
  page: z.number().int().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  required: z.boolean().optional().default(true),
});

const PatchBody = z.object({
  subject: z.string().trim().min(1).max(160).optional(),
  message: z.string().trim().max(2000).nullable().optional(),
  fields: z.array(Field).optional(),
});

async function loadOwned(id: string, userId: string) {
  return prisma.envelope.findFirst({
    where: { id, userId, deletedAt: null },
    include: {
      recipients: true,
      fields: true,
      events: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const envelope = await loadOwned(params.id, userId);
  if (!envelope) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const file = await prisma.file.findUnique({ where: { id: envelope.sourceFileId } });
  return NextResponse.json({ envelope, sourceUrl: file?.url ?? null, sourceName: file?.originalName ?? null });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  try {
    const data = PatchBody.parse(await req.json());
    const envelope = await loadOwned(params.id, userId);
    if (!envelope) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (envelope.status !== "draft")
      return NextResponse.json({ error: "Envelope already sent — cannot edit." }, { status: 400 });

    if (data.fields) {
      // All assigned recipients must belong to this envelope.
      const validRecipientIds = new Set(envelope.recipients.map((r) => r.id));
      for (const f of data.fields) {
        if (!validRecipientIds.has(f.recipientId)) {
          return NextResponse.json({ error: `Field assigned to unknown recipient` }, { status: 400 });
        }
      }
      // Replace-all field strategy keeps the API simple — small edits send the
      // full list, which is fine for the field counts we expect (<100).
      await prisma.envelopeField.deleteMany({ where: { envelopeId: envelope.id } });
      if (data.fields.length > 0) {
        await prisma.envelopeField.createMany({
          data: data.fields.map((f) => ({
            envelopeId: envelope.id,
            recipientId: f.recipientId,
            type: f.type,
            page: f.page,
            x: f.x,
            y: f.y,
            width: f.width,
            height: f.height,
            required: f.required ?? true,
          })),
        });
      }
    }

    const updated = await prisma.envelope.update({
      where: { id: envelope.id },
      data: {
        subject: data.subject ?? undefined,
        message: data.message === undefined ? undefined : data.message,
      },
    });
    return NextResponse.json({ id: updated.id });
  } catch (e: any) {
    const msg = e?.errors?.[0]?.message ?? e?.message ?? "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const envelope = await loadOwned(params.id, userId);
  if (!envelope) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.envelope.update({
    where: { id: envelope.id },
    data: {
      deletedAt: new Date(),
      status: envelope.status === "completed" ? envelope.status : "voided",
    },
  });
  await prisma.envelopeEvent.create({
    data: { envelopeId: envelope.id, type: "voided" },
  });
  return NextResponse.json({ ok: true });
}
