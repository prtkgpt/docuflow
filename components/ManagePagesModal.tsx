"use client";
import { useEffect, useState } from "react";
import { X, Trash2, RotateCw, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PageOpsState = {
  // Ordered list of source 1-indexed pages to keep. Default identity order.
  order: number[];
  // Per-source-page rotation in degrees (0/90/180/270).
  rotations: Record<number, 0 | 90 | 180 | 270>;
};

type Props = {
  thumbnails: string[];
  state: PageOpsState;
  onClose: () => void;
  onApply: (next: PageOpsState) => void;
};

export function ManagePagesModal({ thumbnails, state, onClose, onApply }: Props) {
  const [order, setOrder] = useState<number[]>(state.order);
  const [rotations, setRotations] = useState<Record<number, 0 | 90 | 180 | 270>>(state.rotations);
  const [dragging, setDragging] = useState<number | null>(null);

  useEffect(() => {
    setOrder(state.order);
    setRotations(state.rotations);
  }, [state]);

  function move(idx: number, dir: -1 | 1) {
    const next = [...order];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setOrder(next);
  }
  function remove(idx: number) {
    if (order.length <= 1) return;
    setOrder(order.filter((_, i) => i !== idx));
  }
  function rotate(sourcePage: number, delta: 90 | 270) {
    setRotations((prev) => {
      const cur = prev[sourcePage] ?? 0;
      const next = (((cur + delta) % 360) + 360) % 360 as 0 | 90 | 180 | 270;
      return { ...prev, [sourcePage]: next };
    });
  }
  function reset() {
    setOrder(thumbnails.map((_, i) => i + 1));
    setRotations({});
  }

  function onDragStart(idx: number) { setDragging(idx); }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  function onDrop(targetIdx: number) {
    if (dragging === null || dragging === targetIdx) return;
    const next = [...order];
    const [moved] = next.splice(dragging, 1);
    next.splice(targetIdx, 0, moved);
    setOrder(next);
    setDragging(null);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-soft max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold">Manage pages</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="border-b border-slate-200 px-5 py-2 text-xs text-slate-500">
          Drag thumbnails to reorder. Use the buttons under each page to rotate or delete.
        </div>
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {order.map((sourcePage, idx) => {
            const rot = rotations[sourcePage] ?? 0;
            return (
              <div
                key={`${sourcePage}-${idx}`}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(idx)}
                className={cn(
                  "rounded-xl border bg-white p-2 cursor-move transition-shadow",
                  dragging === idx ? "border-brand-500 shadow-soft" : "border-slate-200 hover:border-slate-400",
                )}
              >
                <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-slate-50 grid place-items-center">
                  <img
                    src={thumbnails[sourcePage - 1]}
                    alt={`Page ${sourcePage}`}
                    className="block max-w-full max-h-full transition-transform"
                    style={{ transform: `rotate(${rot}deg)` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>Page {idx + 1}{sourcePage !== idx + 1 ? ` (orig ${sourcePage})` : ""}</span>
                  {rot !== 0 && <span className="rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px]">{rot}°</span>}
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100 disabled:opacity-30" aria-label="Move left">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === order.length - 1} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100 disabled:opacity-30" aria-label="Move right">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => rotate(sourcePage, 270)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100" aria-label="Rotate left">
                    <RotateCcw className="h-4 w-4" />
                  </button>
                  <button onClick={() => rotate(sourcePage, 90)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-slate-100" aria-label="Rotate right">
                    <RotateCw className="h-4 w-4" />
                  </button>
                  <div className="flex-1" />
                  <button onClick={() => remove(idx)} disabled={order.length <= 1} className="grid h-8 w-8 place-items-center rounded-md hover:bg-red-50 text-red-600 disabled:opacity-30" aria-label="Delete page">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <Button variant="ghost" onClick={reset}>Reset</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onApply({ order, rotations })}>Apply</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
