import * as XLSX from "xlsx";
import { extractPdfText } from "./extract-text";

// Convert a PDF buffer to a multi-sheet Excel workbook. Each PDF page
// becomes one sheet. We don't try to be clever about reconstructing
// every table — we split each line on runs of 2+ spaces (a common
// signal of column separation in PDF text extraction). For clean,
// column-aligned PDFs that gives a usable spreadsheet; for messy
// layouts the result is still better than copy-paste.
export async function pdfToExcel(buffer: Buffer | Uint8Array): Promise<Uint8Array> {
  const { pageTexts } = await extractPdfText(buffer);

  const workbook = XLSX.utils.book_new();
  let totalRows = 0;

  pageTexts.forEach((pageText, idx) => {
    const rows = lineToColumns(pageText || "");
    const sheet = XLSX.utils.aoa_to_sheet(rows.length ? rows : [["[no text on page]"]]);
    XLSX.utils.book_append_sheet(workbook, sheet, `Page ${idx + 1}`.slice(0, 31));
    totalRows += rows.length;
  });

  if (pageTexts.length === 0 || totalRows === 0) {
    const sheet = XLSX.utils.aoa_to_sheet([
      ["No text could be extracted from this PDF."],
      ["If it's a scan, run OCR PDF first."],
    ]);
    XLSX.utils.book_append_sheet(workbook, sheet, "README");
  }

  const out = XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return new Uint8Array(out);
}

function lineToColumns(text: string): string[][] {
  const lines = text.split(/\r?\n+/);
  const rows: string[][] = [];
  for (const raw of lines) {
    const line = raw.replace(/\t+/g, "  ").trimEnd();
    if (!line.trim()) continue;
    // Split on runs of 2+ spaces. Keeps single spaces inside a cell.
    const cols = line.split(/ {2,}/).map((c) => c.trim()).filter((c, i, arr) => i < arr.length - 1 || c !== "");
    rows.push(cols.length ? cols : [line.trim()]);
  }
  return rows;
}
