"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, FileText, Download, RotateCcw, ScanText, CheckCircle2, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { LANGUAGES, findLanguage, ENGLISH } from "@/lib/i18n/languages";

type Stage =
  | { kind: "idle" }
  | { kind: "rendering"; page: number; total: number }
  | { kind: "ocr"; page: number; total: number }
  | { kind: "done"; pageTexts: string[]; pdfBytes: Uint8Array | null };

function Inner() {
  const params = useSearchParams();
  const fileId = params.get("fileId");
  const initialLang = findLanguage(params.get("lang")) ?? ENGLISH;

  const [meta, setMeta] = useState<{ originalName: string; url: string } | null>(null);
  const [lang, setLang] = useState(initialLang.code);
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
      const { PDFDocument } = await import("pdf-lib");

      const lang = findLanguage(document.querySelector<HTMLSelectElement>("#ocr-lang")?.value) ?? ENGLISH;

      const pdf = await pdfjs.getDocument({ url: meta.url }).promise;
      const total = pdf.numPages;

      const worker = await Tesseract.createWorker(lang.tesseract);
      const pageTexts: string[] = [];
      const pagePdfs: Uint8Array[] = [];
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

          setStage({ kind: "ocr", page: i, total });
          const result: any = await worker.recognize(canvas, {}, { pdf: true } as any);
          pageTexts.push(result?.data?.text || "");
          // Tesseract.js v5 returns the searchable PDF in result.data.pdf as
          // a number array; convert to Uint8Array for pdf-lib.
          const rawPdf = result?.data?.pdf;
          if (rawPdf) pagePdfs.push(new Uint8Array(rawPdf));
        }
      } finally {
        await worker.terminate();
      }

      // Merge per-page searchable PDFs into one. Each page is its own PDF
      // doc carrying the rendered image with an invisible text layer below.
      let mergedBytes: Uint8Array | null = null;
      if (pagePdfs.length === pageTexts.length && pagePdfs.length > 0) {
        const out = await PDFDocument.create();
        for (const buf of pagePdfs) {
          try {
            const src = await PDFDocument.load(buf, { ignoreEncryption: true });
            const copied = await out.copyPages(src, src.getPageIndices());
            copied.forEach((p) => out.addPage(p));
          } catch { /* ignore one bad page */ }
        }
        mergedBytes = await out.save();
      }

      setStage({ kind: "done", pageTexts, pdfBytes: mergedBytes });
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

  function downloadPdf(bytes: Uint8Array) {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(meta?.originalName || "ocr").replace(/\.pdf$/i, "")}-searchable.pdf`;
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
          <div>
            <label htmlFor="ocr-lang" className="text-sm font-medium text-slate-800">PDF language</label>
            <select
              id="ocr-lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.flag} {l.name}{l.nativeName && l.nativeName !== l.name ? ` (${l.nativeName})` : ""}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">First time using this language? We&apos;ll download a small Tesseract model (~10 MB), then cache it.</p>
          </div>
          <Button size="lg" className="w-full" onClick={run}>
            <ScanText className="h-4 w-4" /> Run OCR (in your browser)
          </Button>
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
              {stage.pdfBytes && (
                <Button size="lg" onClick={() => downloadPdf(stage.pdfBytes!)}>
                  <FileType2 className="h-4 w-4" /> Download searchable PDF
                </Button>
              )}
              <Button size="lg" variant={stage.pdfBytes ? "outline" : "default"} onClick={() => downloadTxt(stage.pageTexts)}>
                <Download className="h-4 w-4" /> Download .txt
              </Button>
              <Button variant="ghost" onClick={() => setStage({ kind: "idle" })}>Run again</Button>
            </div>
            {stage.pdfBytes && (
              <p className="mt-2 text-xs text-emerald-800/80">
                The searchable PDF keeps your original page images and adds an invisible text layer beneath. Open in any PDF viewer and try Cmd/Ctrl+F to search.
              </p>
            )}
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
