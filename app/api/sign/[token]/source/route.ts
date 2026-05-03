import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readByUrlOrName } from "@/lib/storage";
import { toUint8 } from "@/lib/bytes";

export const runtime = "nodejs";

// Streams the source PDF to a signer who holds a valid signing token.
// Bypasses normal auth — the unguessable 256-bit token is the auth.
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const recipient = await prisma.envelopeRecipient.findUnique({
    where: { signingToken: params.token },
    include: { envelope: true },
  });
  if (!recipient || recipient.envelope.deletedAt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const file = await prisma.file.findUnique({ where: { id: recipient.envelope.sourceFileId } });
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // For Vercel Blob (https://) we just redirect — the URL is public-by-token
  // already and saves us the streaming roundtrip.
  if (file.url.startsWith("http")) {
    return NextResponse.redirect(file.url, 302);
  }
  const buf = await readByUrlOrName(file.url);
  return new NextResponse(toUint8(buf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file.originalName}"`,
      "Cache-Control": "private, max-age=300",
    },
  });
}
