"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, FileText, Download, RotateCcw, ScanText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";

type Stage =
  | { kind: "idle" }
  | { kind: "rendering"; page: number; total: number }
  | { kind: "ocr"; page: number; total: number; progress: number }
  | { kind: "done"; pageTexts: string[] };

function Inner() {
  const params = useSearchParams();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<{ originalName: string; url: string } | null>(null);
  const [stage, setStage] = useState<Stage>({ kind: "idle" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => d.file && setMeta({ originalName: d.file.originalName, url: d.file.url }))
      .catch(() => setError("Could not load the file."));
  }, [fileId]);

  async function run() {
    if (!meta) return;
    setError(null);
    try {
      // Lazy-load both pdfjs and tesseract — they're heavy. Keeps the
      // initial page bundle small for users who don't run OCR.
      const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
      const Tesseract = (await import("tesseract.js")).default;

      const pdf = await pdfjs.getDocument({ url: meta.url }).promise;
      const total = pdf.numPages;

      const worker = await Tesseract.createWorker("eng");
      const pageTexts: string[] = [];
      try {
        for (let i = 1; i <= total; i++) {
          setStage({ kind: "rendering", page: i, total });
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas not available");
          await page.render({ canvasContext: ctx, viewport }).promise;

          setStage({ kind: "ocr", page: i, total, progress: 0 });
          const { data } = await worker.recognize(canvas);
          pageTexts.push(data.text || "");
        }
      } finally {
        await worker.terminate();
      }
      setStage({ kind: "done", pageTexts });
    } catch (e: any) {
      setError(e.message || "OCR failed");
      setStage({ kind: "idle" });
    }
  }

  function downloadTxt(pageTexts: string[]) {
    const text = pageTexts
      .map((t, i) => `--- Page ${i + 1} ---\n${t.trim()}\n`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(meta?.originalName || "ocr").replace(/\.pdf$/i, "")}-ocr.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!fileId) return <UploadDropzone redirectTo="/tools/ocr-pdf" />;
  if (!meta) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-500">File ready</p>
            <p className="truncate text-sm font-medium">{meta.originalName}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/tools/ocr-pdf"><RotateCcw className="h-4 w-4" /> New file</Link>
        </Button>
      </div>

      {stage.kind === "idle" && (
        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={run}>
            <ScanText className="h-4 w-4" /> Run OCR (in your browser)
          </Button>
          <p className="text-xs text-slate-500">
            OCR runs on your device using Tesseract.js. The first page takes a few seconds while
            we download the language model (~10 MB, cached after).
          </p>
        </div>
      )}

      {(stage.kind === "rendering" || stage.kind === "ocr") && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-brand-700" />
            {stage.kind === "rendering"
              ? `Rendering page ${stage.page} of ${stage.total}…`
              : `Reading text from page ${stage.page} of ${stage.total}…`}
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-brand-600 transition-all"
              style={{ width: `${Math.round((stage.page / stage.total) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {stage.kind === "done" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-900 inline-flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> OCR complete
            </p>
            <p className="text-sm text-emerald-800">
              Extracted text from {stage.pageTexts.length} page{stage.pageTexts.length === 1 ? "" : "s"}.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="lg" onClick={() => downloadTxt(stage.pageTexts)}>
                <Download className="h-4 w-4" /> Download as .txt
              </Button>
              <Button variant="outline" onClick={() => setStage({ kind: "idle" })}>Run again</Button>
            </div>
          </div>
          <details className="rounded-xl border border-slate-200 bg-white">
            <summary className="cursor-pointer p-3 text-sm font-medium">Preview extracted text</summary>
            <div className="border-t border-slate-200 p-3 text-xs whitespace-pre-wrap font-mono max-h-64 overflow-y-auto text-slate-700">
              {stage.pageTexts.map((t, i) => `--- Page ${i + 1} ---\n${t.trim()}\n\n`).join("")}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export function OcrRunner() {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner />
    </Suspense>
  );
}
