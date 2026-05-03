import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail, envelopeInviteHtml } from "@/lib/email";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const senderName = session?.user?.name || session?.user?.email?.split("@")[0] || "Someone";
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const envelope = await prisma.envelope.findFirst({
    where: { id: params.id, userId, deletedAt: null },
    include: { recipients: true, fields: true },
  });
  if (!envelope) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (envelope.status !== "draft")
    return NextResponse.json({ error: "Already sent" }, { status: 400 });
  if (envelope.fields.length === 0)
    return NextResponse.json({ error: "Add at least one field before sending." }, { status: 400 });

  // Every recipient must have at least one required field — otherwise the
  // signing page has nothing for them to do.
  const fieldsByRecipient = new Map<string, number>();
  envelope.fields.forEach((f) => {
    fieldsByRecipient.set(f.recipientId, (fieldsByRecipient.get(f.recipientId) || 0) + 1);
  });
  const orphan = envelope.recipients.find((r) => !fieldsByRecipient.has(r.id));
  if (orphan) {
    return NextResponse.json(
      { error: `Add at least one field for ${orphan.name} (${orphan.email}).` },
      { status: 400 },
    );
  }

  await prisma.envelope.update({
    where: { id: envelope.id },
    data: { status: "sent", sentAt: new Date() },
  });
  await prisma.envelopeRecipient.updateMany({
    where: { envelopeId: envelope.id },
    data: { status: "sent" },
  });
  await prisma.envelopeEvent.create({
    data: { envelopeId: envelope.id, type: "sent" },
  });

  // Best-effort email delivery — failures are logged but do not roll back
  // the send, since the recipient can still be reminded later.
  await Promise.all(
    envelope.recipients.map(async (r) => {
      const url = absoluteUrl(`/sign/${r.signingToken}`);
      await sendEmail({
        to: r.email,
        subject: `${senderName} sent you "${envelope.subject}" to sign`,
        html: envelopeInviteHtml({
          senderName,
          signerName: r.name,
          subject: envelope.subject,
          message: envelope.message,
          signUrl: url,
        }),
        text: `${senderName} has sent you a document to sign: ${envelope.subject}\n\nReview and sign: ${url}`,
      });
    }),
  );

  return NextResponse.json({ ok: true });
}
