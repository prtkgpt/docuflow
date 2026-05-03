"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Image as ImageIcon, Download, RotateCcw, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";

type Props = {
  from: "jpg" | "png";
  to: "jpg" | "png";
  toolPath: string;
  cta?: string;
};

// Pure client-side image format conversion. We never send the image to a
// server because the browser's <canvas> handles the encoding. JPG → PNG
// preserves quality; PNG → JPG flattens the alpha channel onto white.
export function ImageConvertRunner({ from, to, toolPath, cta }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; name: string; size: number } | null>(null);

  useEffect(() => () => { if (result?.url) URL.revokeObjectURL(result.url); }, [result?.url]);

  const accept = from === "jpg" ? "image/jpeg,image/jpg" : "image/png";
  const targetMime = to === "jpg" ? "image/jpeg" : "image/png";
  const targetExt = to === "jpg" ? "jpg" : "png";
  const fromLabel = from.toUpperCase();
  const toLabel = to.toUpperCase();
  const buttonLabel = cta ?? `Convert to ${toLabel}`;

  function pick(f: File) {
    setError(null);
    setResult(null);
    const isJpg = f.type === "image/jpeg" || /\.jpe?g$/i.test(f.name);
    const isPng = f.type === "image/png" || /\.png$/i.test(f.name);
    if (from === "jpg" && !isJpg) {
      setError(`Please choose a JPG image.`);
      return;
    }
    if (from === "png" && !isPng) {
      setError(`Please choose a PNG image.`);
      return;
    }
    setFile(f);
  }

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = URL.createObjectURL(file);
      const img = await loadImage(url);
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not available");

      if (to === "jpg") {
        // JPG doesn't support transparency; flatten on white.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Failed to encode image"))),
          targetMime,
          to === "jpg" ? 0.95 : undefined,
        );
      });
      const blobUrl = URL.createObjectURL(blob);
      const baseName = file.name.replace(/\.[^.]+$/, "");
      setResult({ url: blobUrl, name: `${baseName}.${targetExt}`, size: blob.size });
    } catch (e: any) {
      setError(e.message || "Conversion failed");
    } finally {
      setBusy(false);
    }
  }

  if (!file) {
    return (
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) pick(f); }}
        className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center transition-colors hover:border-brand-400 hover:bg-slate-50"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
        />
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-700">
          <Upload className="h-6 w-6" />
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-900">Drop your {fromLabel} here</p>
        <p className="text-sm text-slate-500">or click to upload</p>
        <p className="mt-2 text-xs text-slate-400">{fromLabel} files up to 100 MB · runs in your browser</p>
        <div className="mt-5">
          <Button type="button" size="lg">Choose {fromLabel}</Button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
            <ImageIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-500">Image ready</p>
            <p className="truncate text-sm font-medium text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={toolPath} onClick={() => { setFile(null); setResult(null); setError(null); }}>
            <RotateCcw className="h-4 w-4" /> New file
          </Link>
        </Button>
      </div>

      {!result && (
        <Button onClick={convert} disabled={busy} size="lg" className="w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? "Converting…" : buttonLabel}
        </Button>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-emerald-900">Your {toLabel} is ready</p>
              <p className="text-sm text-emerald-800 truncate">{result.name} ({formatBytes(result.size)})</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="lg">
              <a href={result.url} download={result.name}>
                <Download className="h-4 w-4" /> Download {toLabel}
              </a>
            </Button>
            <Button variant="outline" onClick={() => { setResult(null); setFile(null); }}>Convert another</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}
