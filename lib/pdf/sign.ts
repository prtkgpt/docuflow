import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";

export type SignatureInput =
  | { kind: "text"; text: string }
  | { kind: "image"; dataUrl: string };

export type SignPlacement = {
  page: number; // 1-indexed
  x: number; // points from left
  y: number; // points from bottom
  width: number;
  height: number;
};

export async function signPdf(
  buffer: Buffer | Uint8Array,
  signature: SignatureInput,
  placement: SignPlacement,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(toUint8(buffer), { ignoreEncryption: true });
  const page = doc.getPage(Math.max(0, Math.min(placement.page - 1, doc.getPageCount() - 1)));

  if (signature.kind === "text") {
    const font = await doc.embedFont(StandardFonts.HelveticaOblique);
    const size = Math.max(12, placement.height * 0.6);
    page.drawText(signature.text, {
      x: placement.x,
      y: placement.y,
      size,
      font,
      color: rgb(0.05, 0.1, 0.4),
    });
  } else {
    const base64 = signature.dataUrl.split(",")[1] ?? signature.dataUrl;
    const bytes = toUint8(Buffer.from(base64, "base64"));
    const isPng = signature.dataUrl.includes("image/png") || !signature.dataUrl.includes("image/");
    const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
    page.drawImage(img, {
      x: placement.x,
      y: placement.y,
      width: placement.width,
      height: placement.height,
    });
  }
  return doc.save();
}
