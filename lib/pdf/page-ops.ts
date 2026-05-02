import { PDFDocument, degrees } from "pdf-lib";

// Page-level operations applied during the bake step.
// `keep` is the ordered list of 1-indexed source pages to retain. Pages not
// listed are dropped; entries can repeat to duplicate pages.
// `rotate` is keyed by source 1-indexed page and adds the given rotation
// degrees to that page (after copy).
export type PageOps = {
  keep?: number[];
  rotate?: Record<number, 0 | 90 | 180 | 270>;
};

export async function applyPageOps(
  source: PDFDocument,
  ops: PageOps,
): Promise<{ doc: PDFDocument; oldToNew: Map<number, number[]> }> {
  const total = source.getPageCount();
  const keep = (ops.keep && ops.keep.length > 0
    ? ops.keep
    : Array.from({ length: total }, (_, i) => i + 1)
  ).filter((p) => p >= 1 && p <= total);

  if (keep.length === 0) {
    throw new Error("Cannot remove all pages");
  }

  const target = await PDFDocument.create();
  const copied = await target.copyPages(source, keep.map((p) => p - 1));
  const oldToNew = new Map<number, number[]>();
  copied.forEach((p, idx) => {
    target.addPage(p);
    const src = keep[idx];
    if (!oldToNew.has(src)) oldToNew.set(src, []);
    oldToNew.get(src)!.push(idx + 1);
  });

  // Apply rotations on the new pages
  if (ops.rotate) {
    for (const [oldPageStr, deg] of Object.entries(ops.rotate)) {
      const oldPage = parseInt(oldPageStr, 10);
      const newPages = oldToNew.get(oldPage) ?? [];
      for (const np of newPages) {
        const page = target.getPage(np - 1);
        const current = page.getRotation().angle || 0;
        page.setRotation(degrees(((current + deg) % 360 + 360) % 360));
      }
    }
  }

  return { doc: target, oldToNew };
}
