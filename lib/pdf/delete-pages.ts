import { PDFDocument } from "pdf-lib";
import { parsePageRanges } from "@/lib/utils";
import { toUint8 } from "@/lib/bytes";

export async function deletePages(
  buffer: Buffer | Uint8Array,
  ranges: string,
): Promise<Uint8Array> {
  const src = await PDFDocument.load(toUint8(buffer), { ignoreEncryption: true });
  const total = src.getPageCount();
  const remove = new Set(parsePageRanges(ranges, total));
  const keep = Array.from({ length: total }, (_, i) => i + 1).filter((p) => !remove.has(p));
  if (keep.length === 0) throw new Error("Cannot delete all pages");

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, keep.map((p) => p - 1));
  copied.forEach((p) => out.addPage(p));
  return out.save();
}
