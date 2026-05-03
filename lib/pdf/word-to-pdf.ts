import { PDFDocument, PDFFont, StandardFonts } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";

// Convert a DOCX buffer to a PDF. We use mammoth to pull simple HTML out
// of the .docx, then render the structural blocks (headings, paragraphs,
// list items) into a PDF using pdf-lib. Tables, images, and inline
// formatting (bold/italic) aren't preserved — that's a separate, much
// larger problem.
export async function wordToPdf(buffer: Buffer | Uint8Array): Promise<Uint8Array> {
  const mammoth = (await import("mammoth")).default ?? (await import("mammoth"));
  const { value: html } = await (mammoth as any).convertToHtml({ buffer: Buffer.from(toUint8(buffer)) });
  const blocks = htmlToBlocks(html);

  const doc = await PDFDocument.create();
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // A4 in points
  const PAGE = { w: 595, h: 842 };
  const margin = 56;          // ~0.78 in
  const usableWidth = PAGE.w - 2 * margin;
  const minY = margin;
  const startY = PAGE.h - margin;

  let page = doc.addPage([PAGE.w, PAGE.h]);
  let cursor = startY;

  function newPage() {
    page = doc.addPage([PAGE.w, PAGE.h]);
    cursor = startY;
  }
  function ensure(space: number) {
    if (cursor - space < minY) newPage();
  }
  function drawWrapped(text: string, font: PDFFont, size: number, lineGap: number, x = margin, maxW = usableWidth) {
    if (!text.trim()) return;
    const lines = wrapText(text, font, size, maxW);
    for (const line of lines) {
      ensure(size + lineGap);
      page.drawText(line, { x, y: cursor - size, size, font });
      cursor -= size + lineGap;
    }
  }

  for (const block of blocks) {
    if (block.type === "heading") {
      const sizeMap: Record<number, number> = { 1: 22, 2: 18, 3: 16, 4: 14, 5: 13, 6: 12 };
      const size = sizeMap[block.level] ?? 14;
      cursor -= size * 0.4;
      drawWrapped(block.text, helvBold, size, 4);
      cursor -= 6;
    } else if (block.type === "paragraph") {
      drawWrapped(block.text, helv, 11, 4);
      cursor -= 4;
    } else if (block.type === "list-item") {
      const bulletWidth = 14;
      const indent = block.ordered ? `${block.index}. ` : "•";
      ensure(11 + 4);
      page.drawText(indent, { x: margin, y: cursor - 11, size: 11, font: helv });
      const wrapped = wrapText(block.text, helv, 11, usableWidth - bulletWidth);
      wrapped.forEach((line, i) => {
        if (i > 0) ensure(11 + 4);
        page.drawText(line, { x: margin + bulletWidth, y: cursor - 11, size: 11, font: helv });
        cursor -= 11 + 4;
      });
      cursor -= 2;
    } else if (block.type === "blank") {
      cursor -= 8;
    }
  }

  return doc.save();
}

// ---------------------------------------------------------------------------

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list-item"; text: string; ordered: boolean; index: number }
  | { type: "blank" };

function htmlToBlocks(html: string): Block[] {
  const blocks: Block[] = [];

  // Tolerant block-level regex; mammoth's HTML output is clean enough.
  const blockRe = /<(h[1-6]|p|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = blockRe.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const inner = m[2];
    if (tag.startsWith("h")) {
      const text = stripTags(inner).trim();
      if (text) blocks.push({ type: "heading", level: parseInt(tag[1], 10), text });
    } else if (tag === "p") {
      const text = stripTags(inner).trim();
      if (text) blocks.push({ type: "paragraph", text });
      else blocks.push({ type: "blank" });
    } else if (tag === "ul" || tag === "ol") {
      const ordered = tag === "ol";
      let i = 1;
      const liRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
      let lm: RegExpExecArray | null;
      while ((lm = liRe.exec(inner)) !== null) {
        const text = stripTags(lm[1]).trim();
        if (text) blocks.push({ type: "list-item", text, ordered, index: i++ });
      }
    }
  }
  return blocks;
}

function stripTags(s: string): string {
  return s
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/?(strong|b|em|i|u|span|a|small|sub|sup|mark)\b[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  // Honor explicit newlines from <br> too.
  const paragraphs = text.split(/\n+/);
  const out: string[] = [];
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    let current = "";
    for (const word of words) {
      const test = current ? current + " " + word : word;
      const w = font.widthOfTextAtSize(sanitize(test), size);
      if (w > maxWidth && current) {
        out.push(sanitize(current));
        current = word;
      } else {
        current = test;
      }
    }
    if (current) out.push(sanitize(current));
  }
  return out;
}

// pdf-lib's StandardFonts can't render characters outside WinAnsi (e.g.
// many Unicode quotes/dashes). Replace the most common offenders so the
// PDF doesn't error on save.
function sanitize(s: string): string {
  return s
    .replace(/[‘’‚‛′]/g, "'")
    .replace(/[“”„‟″]/g, '"')
    .replace(/[–—−]/g, "-")
    .replace(/…/g, "...")
    .replace(/ /g, " ");
}
