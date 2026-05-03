"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, FileText, Download, RotateCcw, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";

type Page = { num: number; dataUrl: string };

function Inner() {
  const params = useSearchParams();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<{ originalName: string; url: string } | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => d.file && setMeta({ originalName: d.file.originalName, url: d.file.url }));
  }, [fileId]);

  async function convert() {
    if (!meta) return;
    setBusy(true); setError(null); setPages([]); setDone(false);
    try {
      const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
      const pdf = await pdfjs.getDocument({ url: meta.url }).promise;
      const out: Page[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        await page.render({ canvasContext: ctx, viewport }).promise;
        out.push({ num: i, dataUrl: canvas.toDataURL("image/jpeg", 0.92) });
      }
      setPages(out);
      setDone(true);
    } catch (e: any) {
      setError(e.message || "Conversion failed");
    } finally {
      setBusy(false);
    }
  }

  async function downloadAll() {
    const JSZipMod = await import("jszip");
    const zip = new JSZipMod.default();
    pages.forEach((p) => {
      const base64 = p.dataUrl.split(",")[1];
      zip.file(`page-${String(p.num).padStart(3, "0")}.jpg`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(meta?.originalName || "pdf").replace(/\.pdf$/i, "")}-images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!fileId) return <UploadDropzone redirectTo="/tools/pdf-to-jpg" />;
  if (!meta) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 shrink-0"><FileText className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-500">File ready</p>
            <p className="truncate text-sm font-medium">{meta.originalName}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm"><Link href="/tools/pdf-to-jpg"><RotateCcw className="h-4 w-4" /> New file</Link></Button>
      </div>

      {!done && (
        <Button size="lg" className="w-full" onClick={convert} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          {busy ? "Converting…" : "Convert to JPG"}
        </Button>
      )}

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {done && (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-900 inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> {pages.length} JPG{pages.length === 1 ? "" : "s"} ready</p>
            <div className="mt-3 flex gap-2">
              <Button size="lg" onClick={downloadAll}><Download className="h-4 w-4" /> Download all (.zip)</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {pages.map((p) => (
              <a
                key={p.num}
                href={p.dataUrl}
                download={`page-${String(p.num).padStart(3, "0")}.jpg`}
                className="group rounded-lg border border-slate-200 overflow-hidden hover:border-brand-400 transition"
              >
                <img src={p.dataUrl} alt={`Page ${p.num}`} className="block w-full" />
                <div className="px-2 py-1 text-xs text-slate-600 group-hover:text-brand-700">Page {p.num} · download</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function PdfToJpgRunner() {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner />
    </Suspense>
  );
}
