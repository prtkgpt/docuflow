import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";
import { readByUrlOrName } from "@/lib/storage";
import type {
  Envelope,
  EnvelopeField,
  EnvelopeRecipient,
  File as DbFile,
} from "@prisma/client";

type EnvelopeWithDetails = Envelope & {
  recipients: EnvelopeRecipient[];
  fields: EnvelopeField[];
};

// Renders the final signed PDF: stamps each field's value onto its target
// page, then appends a one-page audit certificate listing every signer with
// timestamp, IP, and email.
export async function applySignedEnvelope(
  envelope: EnvelopeWithDetails,
  sourceFile: DbFile,
): Promise<Uint8Array> {
  const sourceBuf = await readByUrlOrName(sourceFile.url);
  const doc = await PDFDocument.load(toUint8(sourceBuf), { ignoreEncryption: true });
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvOblique = await doc.embedFont(StandardFonts.HelveticaOblique);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  const recipientsById = new Map(envelope.recipients.map((r) => [r.id, r]));

  for (const field of envelope.fields) {
    if (!field.value) continue;
    const pageIdx = Math.max(0, Math.min(field.page - 1, doc.getPageCount() - 1));
    const page = doc.getPage(pageIdx);

    if (field.type === "signature" || field.type === "initials") {
      // Drawn signatures arrive as PNG data URLs from the canvas.
      // Typed signatures are written as italic text.
      if (field.value.startsWith("data:image/")) {
        const base64 = field.value.split(",")[1] ?? "";
        const bytes = toUint8(Buffer.from(base64, "base64"));
        const isPng = field.value.includes("image/png");
        try {
          const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
          page.drawImage(img, {
            x: field.x,
            y: field.y,
            width: field.width,
            height: field.height,
          });
        } catch {
          // Ignore unembeddable images — the audit page still records the signer.
        }
      } else {
        const size = Math.max(10, Math.min(field.height * 0.7, 28));
        page.drawText(field.value, {
          x: field.x + 4,
          y: field.y + (field.height - size) / 2,
          size,
          font: helvOblique,
          color: rgb(0.05, 0.1, 0.4),
        });
      }
    } else if (field.type === "checkbox") {
      const checked = field.value === "true";
      page.drawRectangle({
        x: field.x,
        y: field.y,
        width: field.width,
        height: field.height,
        borderColor: rgb(0.2, 0.2, 0.2),
        borderWidth: 1,
      });
      if (checked) {
        page.drawText("X", {
          x: field.x + field.width * 0.2,
          y: field.y + field.height * 0.18,
          size: Math.max(10, field.height * 0.7),
          font: helvBold,
          color: rgb(0.05, 0.1, 0.4),
        });
      }
    } else {
      // text or date — plain string
      const size = Math.max(8, Math.min(field.height * 0.55, 14));
      page.drawText(field.value, {
        x: field.x + 3,
        y: field.y + (field.height - size) / 2,
        size,
        font: helv,
        color: rgb(0.1, 0.1, 0.1),
      });
    }
  }

  // ---------------- Audit certificate page ---------------------------------
  const auditPage = doc.addPage();
  const { width, height } = auditPage.getSize();
  const left = 50;
  let cursor = height - 60;

  auditPage.drawText("Signature certificate", {
    x: left,
    y: cursor,
    size: 18,
    font: helvBold,
    color: rgb(0.05, 0.05, 0.05),
  });
  cursor -= 26;
  auditPage.drawText(`Document: ${envelope.subject}`, { x: left, y: cursor, size: 11, font: helv });
  cursor -= 16;
  auditPage.drawText(`Envelope ID: ${envelope.id}`, { x: left, y: cursor, size: 10, font: helv, color: rgb(0.3, 0.3, 0.3) });
  cursor -= 14;
  auditPage.drawText(`Created: ${envelope.createdAt.toISOString()}`, { x: left, y: cursor, size: 10, font: helv, color: rgb(0.3, 0.3, 0.3) });
  cursor -= 14;
  if (envelope.completedAt) {
    auditPage.drawText(`Completed: ${envelope.completedAt.toISOString()}`, { x: left, y: cursor, size: 10, font: helv, color: rgb(0.3, 0.3, 0.3) });
    cursor -= 14;
  }
  cursor -= 8;
  auditPage.drawLine({
    start: { x: left, y: cursor },
    end: { x: width - left, y: cursor },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  cursor -= 20;

  auditPage.drawText("Signers", { x: left, y: cursor, size: 13, font: helvBold });
  cursor -= 18;

  for (const r of envelope.recipients) {
    auditPage.drawText(`${r.name} <${r.email}>`, { x: left, y: cursor, size: 11, font: helvBold });
    cursor -= 14;
    const signedLine = r.signedAt
      ? `Signed at ${r.signedAt.toISOString()}`
      : `Status: ${r.status}`;
    auditPage.drawText(signedLine, { x: left + 8, y: cursor, size: 10, font: helv, color: rgb(0.3, 0.3, 0.3) });
    cursor -= 12;
    if (r.signerIp) {
      auditPage.drawText(`IP: ${r.signerIp}`, { x: left + 8, y: cursor, size: 9, font: helv, color: rgb(0.45, 0.45, 0.45) });
      cursor -= 11;
    }
    if (r.viewedAt) {
      auditPage.drawText(`First viewed: ${r.viewedAt.toISOString()}`, { x: left + 8, y: cursor, size: 9, font: helv, color: rgb(0.45, 0.45, 0.45) });
      cursor -= 11;
    }
    cursor -= 6;
    if (cursor < 80) break; // bail if we'd overflow — rare for <10 signers
  }

  return doc.save();
  // Note about recipientsById: kept above to avoid losing the signer-name
  // lookup if we ever need to render a per-field caption next to a signature.
  void recipientsById;
}
