"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, FileText, Download, RotateCcw, CheckCircle2, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/components/UploadDropzone";
import { formatBytes } from "@/lib/utils";
import { asDownloadUrl } from "@/lib/download-url";

type ToolResponse = { url: string; size: number; name?: string };

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<{ originalName: string; size: number } | null>(null);
  const [pages, setPages] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolResponse | null>(null);

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => d.file && setMeta({ originalName: d.file.originalName, size: d.file.size }));
  }, [fileId]);

  async function run() {
    if (!fileId) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/tools/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, ranges: pages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Split failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!fileId) {
    return <UploadDropzone redirectTo="/tools/split-pdf" />;
  }
  if (!meta) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></div>;
  }
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
        <Button asChild variant="ghost" size="sm"><Link href="/tools/split-pdf"><RotateCcw className="h-4 w-4" /> New file</Link></Button>
      </div>

      <div>
        <Label htmlFor="pages">Pages to keep</Label>
        <Input id="pages" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="1-3, 5, 8-10" />
        <p className="mt-1 text-xs text-slate-500">Examples: <code>1</code> · <code>1-3</code> · <code>1, 4, 7</code> · <code>2-5, 9-10</code></p>
      </div>

      {!result && (
        <Button size="lg" className="w-full" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}
          {busy ? "Splitting…" : "Extract pages"}
        </Button>
      )}

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-900 inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Done</p>
          <p className="text-sm text-emerald-800">{result.name} ({formatBytes(result.size)})</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <Button asChild size="lg"><a href={asDownloadUrl(result.url, result.name)} download={result.name}><Download className="h-4 w-4" /> Download</a></Button>
            <Button variant="outline" onClick={() => setResult(null)}>Try other pages</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SplitRunner() {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner />
    </Suspense>
  );
}
