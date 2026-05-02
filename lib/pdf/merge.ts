import { PDFDocument } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";

export async function mergePdfs(buffers: Buffer[] | Uint8Array[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const buf of buffers) {
    const src = await PDFDocument.load(toUint8(buf), { ignoreEncryption: true });
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return out.save();
}
