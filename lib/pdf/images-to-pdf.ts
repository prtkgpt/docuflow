import { PDFDocument } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";

// Combine a list of images (each given as a buffer + mimetype) into a
// single PDF. Each image becomes one page sized to the image's pixel
// dimensions so it fits exactly without distortion.
export async function imagesToPdf(
  images: { buffer: Buffer | Uint8Array; mimeType: string }[],
): Promise<Uint8Array> {
  if (images.length === 0) throw new Error("No images provided");
  const out = await PDFDocument.create();
  for (const img of images) {
    const bytes = toUint8(img.buffer);
    const isPng = img.mimeType.includes("png");
    const embedded = isPng ? await out.embedPng(bytes) : await out.embedJpg(bytes);
    const page = out.addPage([embedded.width, embedded.height]);
    page.drawImage(embedded, { x: 0, y: 0, width: embedded.width, height: embedded.height });
  }
  return out.save();
}
