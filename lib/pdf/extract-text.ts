import { PDFDocument } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";

// Lightweight server-side text extractor. We use pdfjs-dist's legacy build
// which works in Node without a DOM. If extraction fails (image-only PDFs)
// the caller should fall back to OCR or surface an error.
export async function extractPdfText(buffer: Buffer | Uint8Array): Promise<{
  text: string;
  pageTexts: string[];
  pageCount: number;
}> {
  const data = toUint8(buffer);
  // Quickly read page count via pdf-lib (cheap and reliable).
  const meta = await PDFDocument.load(data, { ignoreEncryption: true });
  const pageCount = meta.getPageCount();

  let pdfjs: any;
  try {
    pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  } catch {
    return { text: "", pageTexts: Array(pageCount).fill(""), pageCount };
  }
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true, isEvalSupported: false });
  const pdf = await loadingTask.promise;

  const pageTexts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((it: any) => ("str" in it ? it.str : "")).join(" ");
    pageTexts.push(text);
  }
  return { text: pageTexts.join("\n\n"), pageTexts, pageCount: pdf.numPages };
}
