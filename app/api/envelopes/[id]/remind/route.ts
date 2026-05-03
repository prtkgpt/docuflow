import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail, envelopeReminderHtml } from "@/lib/email";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

const REMIND_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const senderName = session?.user?.name || session?.user?.email?.split("@")[0] || "The sender";
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const envelope = await prisma.envelope.findFirst({
    where: { id: params.id, userId, deletedAt: null },
    include: { recipients: true },
  });
  if (!envelope) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (envelope.status === "draft" || envelope.status === "voided")
    return NextResponse.json({ error: "Send the envelope first." }, { status: 400 });

  const pending = envelope.recipients.filter((r) => r.status !== "signed" && r.status !== "declined");
  if (pending.length === 0)
    return NextResponse.json({ error: "Nobody left to remind." }, { status: 400 });

  const now = Date.now();
  let sent = 0;
  for (const r of pending) {
    if (r.remindedAt && now - r.remindedAt.getTime() < REMIND_COOLDOWN_MS) continue;
    await sendEmail({
      to: r.email,
      subject: `Reminder: please sign "${envelope.subject}"`,
      html: envelopeReminderHtml({
        senderName,
        signerName: r.name,
        subject: envelope.subject,
        signUrl: absoluteUrl(`/sign/${r.signingToken}`),
      }),
    });
    await prisma.envelopeRecipient.update({
      where: { id: r.id },
      data: { remindedAt: new Date(), remindCount: { increment: 1 } },
    });
    sent++;
  }
  if (sent > 0) {
    await prisma.envelopeEvent.create({
      data: { envelopeId: envelope.id, type: "reminded", meta: `count=${sent}` },
    });
  }
  return NextResponse.json({ ok: true, remindersSent: sent });
}
