import { PDFDocument, degrees } from "pdf-lib";
import { parsePageRanges } from "@/lib/utils";

export async function rotatePdf(
  buffer: Buffer | Uint8Array,
  ranges: string,
  angle: 90 | 180 | 270,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(buffer as Uint8Array, { ignoreEncryption: true });
  const total = doc.getPageCount();
  const targets = ranges.trim()
    ? parsePageRanges(ranges, total)
    : Array.from({ length: total }, (_, i) => i + 1);

  for (const p of targets) {
    const page = doc.getPage(p - 1);
    const current = page.getRotation().angle || 0;
    page.setRotation(degrees((current + angle) % 360));
  }
  return doc.save();
}
