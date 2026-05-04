import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { applySignedEnvelope } from "@/lib/envelopes/render";
import { saveBuffer } from "@/lib/storage";
import { sendEmail, envelopeCompletedHtml } from "@/lib/email";
import { absoluteUrl } from "@/lib/site";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip");
}

async function loadByToken(token: string) {
  return prisma.envelopeRecipient.findUnique({
    where: { signingToken: token },
    include: {
      envelope: {
        include: {
          recipients: { select: { id: true, name: true, email: true, status: true, order: true } },
          fields: true,
          user: { select: { name: true, email: true } },
        },
      },
      fields: true,
    },
  });
}

export async function GET(req: NextRequest, { params }: { params: { token: string } }) {
  const recipient = await loadByToken(params.token);
  if (!recipient || recipient.envelope.deletedAt) {
    return NextResponse.json({ error: "This signing link is no longer valid." }, { status: 404 });
  }
  if (recipient.envelope.status === "voided") {
    return NextResponse.json({ error: "This document has been cancelled." }, { status: 410 });
  }

  // Mark as viewed only on the first view from this signer.
  if (!recipient.viewedAt) {
    await prisma.envelopeRecipient.update({
      where: { id: recipient.id },
      data: { status: recipient.status === "signed" ? "signed" : "viewed", viewedAt: new Date() },
    });
    if (recipient.envelope.status === "sent") {
      await prisma.envelope.update({
        where: { id: recipient.envelope.id },
        data: { status: "viewed" },
      });
    }
    await prisma.envelopeEvent.create({
      data: {
        envelopeId: recipient.envelope.id,
        recipientId: recipient.id,
        type: "viewed",
        ip: clientIp(req),
        userAgent: req.headers.get("user-agent") || undefined,
      },
    });
  }

  const file = await prisma.file.findUnique({
    where: { id: recipient.envelope.sourceFileId },
    select: { originalName: true },
  });

  return NextResponse.json({
    envelope: {
      id: recipient.envelope.id,
      subject: recipient.envelope.subject,
      message: recipient.envelope.message,
      status: recipient.envelope.status,
      sender: {
        name: recipient.envelope.user.name,
        email: recipient.envelope.user.email,
      },
      sourceName: file?.originalName ?? "document.pdf",
    },
    recipient: {
      id: recipient.id,
      name: recipient.name,
      email: recipient.email,
      status: recipient.status,
      signedAt: recipient.signedAt,
    },
    fields: recipient.fields.map((f) => ({
      id: f.id,
      type: f.type,
      page: f.page,
      x: f.x,
      y: f.y,
      width: f.width,
      height: f.height,
      required: f.required,
      value: f.value,
    })),
  });
}

const FieldSubmission = z.object({
  id: z.string(),
  value: z.string().min(1),
});

const SubmitBody = z.object({
  action: z.literal("sign"),
  fields: z.array(FieldSubmission).min(1),
});

const DeclineBody = z.object({
  action: z.literal("decline"),
  reason: z.string().trim().max(500).optional(),
});

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  // 30 sign/decline attempts per IP per 5 min — well above legitimate
  // signer behavior, well below what would let someone brute-force.
  const rl = checkRateLimit(req, "sign-submit", 30, 5 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests — try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  const recipient = await loadByToken(params.token);
  if (!recipient || recipient.envelope.deletedAt) {
    return NextResponse.json({ error: "This signing link is no longer valid." }, { status: 404 });
  }
  if (recipient.envelope.status === "voided" || recipient.envelope.status === "completed") {
    return NextResponse.json({ error: "This document is no longer accepting signatures." }, { status: 410 });
  }
  if (recipient.status === "signed") {
    return NextResponse.json({ error: "You have already signed this document." }, { status: 400 });
  }

  const ip = clientIp(req);
  const ua = req.headers.get("user-agent") || undefined;
  const body = await req.json().catch(() => null);

  if (body?.action === "decline") {
    const data = DeclineBody.parse(body);
    await prisma.envelopeRecipient.update({
      where: { id: recipient.id },
      data: {
        status: "declined",
        declinedAt: new Date(),
        declineReason: data.reason,
        signerIp: ip || undefined,
        signerUa: ua,
      },
    });
    await prisma.envelope.update({
      where: { id: recipient.envelope.id },
      data: { status: "declined" },
    });
    await prisma.envelopeEvent.create({
      data: {
        envelopeId: recipient.envelope.id,
        recipientId: recipient.id,
        type: "declined",
        ip: ip || undefined,
        userAgent: ua,
        meta: data.reason,
      },
    });
    return NextResponse.json({ ok: true, declined: true });
  }

  const data = SubmitBody.parse(body);
  const required = recipient.fields.filter((f) => f.required);
  const submittedIds = new Set(data.fields.map((f) => f.id));
  const missing = required.find((f) => !submittedIds.has(f.id));
  if (missing) {
    return NextResponse.json(
      { error: "Please fill every required field before submitting." },
      { status: 400 },
    );
  }

  // Persist field values atomically — interactive signers may be on flaky
  // networks, but field IDs are stable so partial writes are still recoverable.
  const valueById = new Map(data.fields.map((f) => [f.id, f.value]));
  await Promise.all(
    recipient.fields.map((f) => {
      const v = valueById.get(f.id);
      if (v === undefined) return Promise.resolve();
      return prisma.envelopeField.update({
        where: { id: f.id },
        data: { value: v, filledAt: new Date() },
      });
    }),
  );

  await prisma.envelopeRecipient.update({
    where: { id: recipient.id },
    data: {
      status: "signed",
      signedAt: new Date(),
      signerIp: ip || undefined,
      signerUa: ua,
    },
  });
  await prisma.envelopeEvent.create({
    data: {
      envelopeId: recipient.envelope.id,
      recipientId: recipient.id,
      type: "signed",
      ip: ip || undefined,
      userAgent: ua,
    },
  });

  // If everyone has signed, render the final PDF (with audit page) and email
  // it to all parties + the sender.
  const fresh = await prisma.envelope.findUnique({
    where: { id: recipient.envelope.id },
    include: { recipients: true, fields: true, user: true },
  });
  let completed = false;
  if (fresh && fresh.recipients.every((r) => r.status === "signed")) {
    const sourceFile = await prisma.file.findUnique({ where: { id: fresh.sourceFileId } });
    if (sourceFile) {
      const finalPdf = await applySignedEnvelope(fresh, sourceFile);
      const stored = await saveBuffer(
        Buffer.from(finalPdf),
        `signed-${sanitize(fresh.subject)}.pdf`,
        "application/pdf",
      );
      const finalFile = await prisma.file.create({
        data: {
          userId: fresh.userId,
          originalName: `signed-${sanitize(fresh.subject)}.pdf`,
          storedName: stored.storedName,
          mimeType: "application/pdf",
          size: stored.size,
          url: stored.url,
        },
      });
      await prisma.envelope.update({
        where: { id: fresh.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          signedFileId: finalFile.id,
        },
      });
      await prisma.envelopeEvent.create({
        data: { envelopeId: fresh.id, type: "completed" },
      });

      const downloadUrl = `${stored.url}${stored.url.includes("?") ? "&" : "?"}download=signed-${sanitize(fresh.subject)}.pdf`;
      const recipients = fresh.recipients.map((r) => r.email);
      const subject = `"${fresh.subject}" — fully signed`;
      await Promise.all([
        sendEmail({
          to: fresh.user.email,
          subject,
          html: envelopeCompletedHtml({ subject: fresh.subject, downloadUrl, forSender: true }),
        }),
        ...recipients.map((to) =>
          sendEmail({
            to,
            subject,
            html: envelopeCompletedHtml({ subject: fresh.subject, downloadUrl, forSender: false }),
          }),
        ),
      ]);
      completed = true;
    }
  }

  return NextResponse.json({ ok: true, completed });
}

function sanitize(s: string): string {
  return s.replace(/[^\w.\- ]+/g, "").replace(/\s+/g, "-").slice(0, 60) || "document";
}
