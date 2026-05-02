import { PDFDocument } from "pdf-lib";
import { parsePageRanges } from "@/lib/utils";
import { toUint8 } from "@/lib/bytes";

export async function splitPdf(
  buffer: Buffer | Uint8Array,
  ranges: string,
): Promise<Uint8Array> {
  const src = await PDFDocument.load(toUint8(buffer), { ignoreEncryption: true });
  const total = src.getPageCount();
  const pages = parsePageRanges(ranges, total);
  if (pages.length === 0) throw new Error("No valid pages selected");

  const out = await PDFDocument.create();
  const copied = await out.copyPages(src, pages.map((p) => p - 1));
  copied.forEach((p) => out.addPage(p));
  return out.save();
}
