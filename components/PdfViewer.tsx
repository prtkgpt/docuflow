"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  src: string; // URL of the PDF
  className?: string;
};

export function PdfViewer({ src, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
        // Use the worker bundled by pdfjs-dist via a CDN to avoid bundler config.
        // Pinning a known-good version that matches the npm pin in package.json.
        pdfjs.GlobalWorkerOptions.workerSrc =
          "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
        const loaded = await pdfjs.getDocument({ url: src, withCredentials: false }).promise;
        if (cancelled) return;
        setPdf(loaded);
        setPage(1);
      } catch (e: any) {
        setError(e?.message || "Failed to load PDF");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const p = await pdf.getPage(page);
      const viewport = p.getViewport({ scale: scale * 1.4 });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx || cancelled) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await p.render({ canvasContext: ctx, viewport }).promise;
    })();
    return () => { cancelled = true; };
  }, [pdf, page, scale]);

  const total = pdf?.numPages || 0;

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!pdf || page <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm tabular-nums text-slate-700">
            {pdf ? `${page} / ${total}` : "—"}
          </span>
          <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={!pdf || page >= total}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-slate-500 tabular-nums w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="icon" onClick={() => setScale((s) => Math.min(3, s + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-slate-50 p-6">
        {loading && (
          <div className="grid place-items-center py-20 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="mt-2 text-sm">Loading PDF…</p>
          </div>
        )}
        {error && (
          <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="mx-auto w-fit rounded-2xl bg-white shadow-soft">
            <canvas ref={canvasRef} className="block" />
          </div>
        )}
      </div>
    </div>
  );
}
