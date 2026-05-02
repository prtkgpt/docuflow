import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { toUint8 } from "@/lib/bytes";
import type { Annotation } from "./annotations";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{1,2}/g) || ["00", "00", "00"];
  const [r, g, b] = m.map((c) => parseInt(c, 16) / 255);
  return rgb(r ?? 0, g ?? 0, b ?? 0);
}

// Bake the annotations onto each page of the PDF. Coordinates are normalized
// to the page (top-left origin); pdf-lib uses bottom-left origin so we flip Y.
export async function bakeAnnotations(
  buffer: Buffer | Uint8Array,
  annotations: Annotation[],
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(toUint8(buffer), { ignoreEncryption: true });
  const pageCount = doc.getPageCount();

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

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
    const toY = (y: number) => H - y * H; // flip Y

    for (const a of anns) {
      switch (a.type) {
        case "text": {
          page.drawText(a.text, {
            x: toX(a.x),
            y: toY(a.y) - a.fontSize, // anchor top-left to baseline
            size: a.fontSize,
            font: helv,
            color: hexToRgb(a.color),
          });
          break;
        }
        case "highlight": {
          page.drawRectangle({
            x: toX(a.x),
            y: toY(a.y + a.h),
            width: a.w * W,
            height: a.h * H,
            color: hexToRgb(a.color),
            opacity: 0.35,
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
              opacity: 1,
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
          } catch {
            // ignore broken images so one bad annotation doesn't fail the whole save
          }
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
            } catch {
              // fall through to text
            }
          } else if (a.text) {
            page.drawText(a.text, {
              x: toX(a.x),
              y: toY(a.y + a.h) + 4,
              size: Math.max(12, a.h * H * 0.7),
              font: helvOblique,
              color: rgb(0.05, 0.1, 0.4),
            });
          }
          break;
        }
      }
    }

  }

  return doc.save();
}
