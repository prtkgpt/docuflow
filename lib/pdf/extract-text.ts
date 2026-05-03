import { extractText, getDocumentProxy } from "unpdf";
import { toUint8 } from "@/lib/bytes";

// Server-side PDF text extraction. We use `unpdf` instead of pdfjs-dist
// directly because pdfjs-dist's legacy build dynamically imports its
// worker (pdf.worker.mjs), which Vercel's NFT can't trace into the
// serverless function bundle. unpdf wraps pdfjs and avoids the worker
// dependency entirely — pure Node, no extra files at runtime.
export async function extractPdfText(buffer: Buffer | Uint8Array): Promise<{
  text: string;
  pageTexts: string[];
  pageCount: number;
}> {
  const data = toUint8(buffer);
  try {
    const pdf = await getDocumentProxy(data);
    const { text, totalPages } = await extractText(pdf, { mergePages: false });
    const pageTexts = Array.isArray(text) ? text : text ? [text] : [];
    return {
      text: pageTexts.join("\n\n"),
      pageTexts,
      pageCount: totalPages,
    };
  } catch {
    // Scanned/encrypted PDFs raise here; the caller surfaces a clear
    // message ("Could not extract text — try OCR first") rather than
    // crashing the whole request.
    return { text: "", pageTexts: [], pageCount: 0 };
  }
}
