import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";
import type { Annotation, FontFamily, TextAnnotation } from "./annotations";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{1,2}/g) || ["00", "00", "00"];
  const [r, g, b] = m.map((c) => parseInt(c, 16) / 255);
  return rgb(r ?? 0, g ?? 0, b ?? 0);
}

type FontSet = {
  regular: PDFFont;
  bold: PDFFont;
  italic: PDFFont;
  boldItalic: PDFFont;
};

async function buildFonts(doc: PDFDocument): Promise<Record<FontFamily, FontSet>> {
  return {
    helvetica: {
      regular: await doc.embedFont(StandardFonts.Helvetica),
      bold: await doc.embedFont(StandardFonts.HelveticaBold),
      italic: await doc.embedFont(StandardFonts.HelveticaOblique),
      boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
    },
    times: {
      regular: await doc.embedFont(StandardFonts.TimesRoman),
      bold: await doc.embedFont(StandardFonts.TimesRomanBold),
      italic: await doc.embedFont(StandardFonts.TimesRomanItalic),
      boldItalic: await doc.embedFont(StandardFonts.TimesRomanBoldItalic),
    },
    courier: {
      regular: await doc.embedFont(StandardFonts.Courier),
      bold: await doc.embedFont(StandardFonts.CourierBold),
      italic: await doc.embedFont(StandardFonts.CourierOblique),
      boldItalic: await doc.embedFont(StandardFonts.CourierBoldOblique),
    },
  };
}

function pickFont(fonts: Record<FontFamily, FontSet>, a: TextAnnotation): PDFFont {
  const family = a.fontFamily ?? "helvetica";
  const set = fonts[family];
  if (a.bold && a.italic) return set.boldItalic;
  if (a.bold) return set.bold;
  if (a.italic) return set.italic;
  return set.regular;
}

// Bake annotations onto each page of the PDF. Coordinates are normalized to
// the page (top-left origin); pdf-lib uses bottom-left origin so we flip Y.
export async function bakeAnnotations(
  buffer: Buffer | Uint8Array,
  annotations: Annotation[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(toUint8(buffer), { ignoreEncryption: true });
  const pageCount = doc.getPageCount();

  const fonts = await buildFonts(doc);

  const grouped = new Map<number, Annotation[]>();
  for (const a of annotations) {
    if (a.page < 1 || a.page > pageCount) continue;
    const arr = grouped.get(a.page) ?? [];
    arr.push(a);
    grouped.set(a.page, arr);
  }

  for (const [pageNum, anns] of grouped) {
    const page = doc.getPage(pageNum - 1);
    const { width: W, height: H } = page.getSize();
    const toX = (x: number) => x * W;
    const toY = (y: number) => H - y * H;

    for (const a of anns) {
      switch (a.type) {
        case "text": {
          const font = pickFont(fonts, a);
          const textWidth = font.widthOfTextAtSize(a.text, a.fontSize);
          let x = toX(a.x);
          if (a.align === "center" && a.width) x = toX(a.x + a.width / 2) - textWidth / 2;
          if (a.align === "right" && a.width) x = toX(a.x + a.width) - textWidth;
          const baselineY = toY(a.y) - a.fontSize;
          page.drawText(a.text, {
            x,
            y: baselineY,
            size: a.fontSize,
            font,
            color: hexToRgb(a.color),
          });
          if (a.underline) {
            page.drawLine({
              start: { x, y: baselineY - 2 },
              end: { x: x + textWidth, y: baselineY - 2 },
              thickness: Math.max(0.8, a.fontSize / 14),
              color: hexToRgb(a.color),
            });
          }
          break;
        }

        case "highlight": {
          page.drawRectangle({
            x: toX(a.x),
            y: toY(a.y + a.h),
            width: a.w * W,
            height: a.h * H,
            color: hexToRgb(a.color),
            opacity: a.opacity ?? 0.35,
          });
          break;
        }

        case "pencil": {
          if (a.points.length < 2) break;
          const pts = a.points.map(([x, y]) => ({ x: toX(x), y: toY(y) }));
          for (let i = 1; i < pts.length; i++) {
            page.drawLine({
              start: pts[i - 1],
              end: pts[i],
              thickness: a.width,
              color: hexToRgb(a.color),
            });
          }
          break;
        }

        case "check":
        case "cross": {
          const sz = a.size * W;
          const cx = toX(a.x);
          const cy = toY(a.y);
          const c = hexToRgb(a.color);
          if (a.type === "check") {
            page.drawLine({ start: { x: cx - sz / 2, y: cy }, end: { x: cx - sz / 6, y: cy - sz / 2 }, thickness: 2.5, color: c });
            page.drawLine({ start: { x: cx - sz / 6, y: cy - sz / 2 }, end: { x: cx + sz / 2, y: cy + sz / 3 }, thickness: 2.5, color: c });
          } else {
            page.drawLine({ start: { x: cx - sz / 2, y: cy + sz / 2 }, end: { x: cx + sz / 2, y: cy - sz / 2 }, thickness: 2.5, color: c });
            page.drawLine({ start: { x: cx - sz / 2, y: cy - sz / 2 }, end: { x: cx + sz / 2, y: cy + sz / 2 }, thickness: 2.5, color: c });
          }
          break;
        }

        case "image": {
          try {
            const isPng = a.dataUrl.includes("image/png");
            const base64 = a.dataUrl.split(",")[1] ?? a.dataUrl;
            const bytes = toUint8(Buffer.from(base64, "base64"));
            const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
            page.drawImage(img, {
              x: toX(a.x),
              y: toY(a.y + a.h),
              width: a.w * W,
              height: a.h * H,
            });
          } catch { /* skip broken */ }
          break;
        }

        case "signature": {
          if (a.dataUrl) {
            try {
              const isPng = a.dataUrl.includes("image/png") || !a.dataUrl.includes("image/");
              const base64 = a.dataUrl.split(",")[1] ?? a.dataUrl;
              const bytes = toUint8(Buffer.from(base64, "base64"));
              const img = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
              page.drawImage(img, {
                x: toX(a.x),
                y: toY(a.y + a.h),
                width: a.w * W,
                height: a.h * H,
              });
            } catch { /* fall through */ }
          } else if (a.text) {
            page.drawText(a.text, {
              x: toX(a.x),
              y: toY(a.y + a.h) + 4,
              size: Math.max(12, a.h * H * 0.7),
              font: fonts.helvetica.italic,
              color: rgb(0.05, 0.1, 0.4),
            });
          }
          break;
        }

        case "ellipse": {
          const cx = toX(a.x + a.w / 2);
          const cy = toY(a.y + a.h / 2);
          page.drawEllipse({
            x: cx,
            y: cy,
            xScale: (a.w * W) / 2,
            yScale: (a.h * H) / 2,
            borderColor: hexToRgb(a.color),
            borderWidth: a.borderWidth ?? 2,
            color: a.fill ? hexToRgb(a.fill) : undefined,
            opacity: a.opacity ?? 1,
          });
          break;
        }

        case "note": {
          const sz = 18;
          page.drawRectangle({
            x: toX(a.x),
            y: toY(a.y) - sz,
            width: sz,
            height: sz,
            color: rgb(0.996, 0.953, 0.78), // pale yellow
            borderColor: hexToRgb(a.color),
            borderWidth: 0.8,
          });
          if (a.text) {
            page.drawText(a.text, {
              x: toX(a.x),
              y: toY(a.y) - sz - 12,
              size: 9,
              font: fonts.helvetica.regular,
              color: hexToRgb(a.color),
              maxWidth: 200,
              lineHeight: 11,
            });
          }
          break;
        }

        case "link": {
          // Visual border + bottom underline as a clickable hint. Embedding a
          // real PDF link annotation requires lower-level pdf-lib API; we
          // surface the URL as visible text underneath so the link is usable.
          page.drawRectangle({
            x: toX(a.x),
            y: toY(a.y + a.h),
            width: a.w * W,
            height: a.h * H,
            borderColor: hexToRgb(a.color),
            borderWidth: 0.8,
            opacity: 0.001,
          });
          if (a.url) {
            page.drawText(a.url, {
              x: toX(a.x),
              y: toY(a.y + a.h) - 10,
              size: 8,
              font: fonts.helvetica.regular,
              color: hexToRgb(a.color),
            });
          }
          break;
        }
      }
    }
  }

  return doc.save();
}
