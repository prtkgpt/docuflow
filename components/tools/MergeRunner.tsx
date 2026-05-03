"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, FileText, Download, RotateCcw, CheckCircle2, GripVertical, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { formatBytes } from "@/lib/utils";

type FileItem = { id: string; originalName: string; size: number };
type ToolResponse = { url: string; size: number; name?: string };

type Props = {
  // Endpoint differs: PDFs use /api/tools/merge, images use /api/tools/images-to-pdf.
  endpoint: string;
  toolPath: string;
  cta: string;
  busyLabel?: string;
};

function Inner({ endpoint, toolPath, cta, busyLabel }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const fileId = params.get("fileId");
  const extras = (params.get("extras") || "").split(",").filter(Boolean);
  const allIds = fileId ? [fileId, ...extras] : [];

  const [items, setItems] = useState<FileItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolResponse | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  useEffect(() => {
    if (allIds.length === 0) return;
    Promise.all(allIds.map((id) => fetch(`/api/files?id=${id}`).then((r) => r.json()).then((d) => d.file)))
      .then((files) => setItems(files.filter(Boolean).map((f: any) => ({ id: f.id, originalName: f.originalName, size: f.size }))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId, params.get("extras")]);

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }
  function onDragStart(i: number) { setDragIdx(i); }
  function onDragOver(e: React.DragEvent) { e.preventDefault(); }
  function onDrop(target: number) {
    if (dragIdx === null || dragIdx === target) return;
    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(target, 0, moved);
    setItems(next);
    setDragIdx(null);
  }

  async function run() {
    if (items.length < 1) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileIds: items.map((i) => i.id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Merge failed");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (allIds.length === 0) {
    return (
      <div className="space-y-3">
        <UploadDropzone redirectTo={toolPath} multiple />
        <p className="text-xs text-slate-500 text-center">Drop two or more files. You'll be able to reorder before merging.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-slate-500">{items.length} file{items.length === 1 ? "" : "s"} ready</p>
        <Button asChild variant="ghost" size="sm"><Link href={toolPath}><RotateCcw className="h-4 w-4" /> Start over</Link></Button>
      </div>

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
        {items.map((it, i) => (
          <li
            key={it.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(i)}
            className={`flex items-center gap-3 px-4 py-3 ${dragIdx === i ? "bg-brand-50" : "hover:bg-slate-50"} cursor-move`}
          >
            <GripVertical className="h-4 w-4 text-slate-400 shrink-0" />
            <FileText className="h-4 w-4 text-brand-700 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-sm">{it.originalName}</span>
            <span className="text-xs text-slate-500">{formatBytes(it.size)}</span>
            <button onClick={() => remove(it.id)} aria-label="Remove" className="text-slate-400 hover:text-red-600">
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm"><Link href={toolPath}><Plus className="h-4 w-4" /> Add more files</Link></Button>
      </div>

      {!result && (
        <Button size="lg" className="w-full" onClick={run} disabled={busy || items.length < 1}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? busyLabel ?? "Working…" : cta}
        </Button>
      )}

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-900 inline-flex items-center gap-2"><CheckCircle2 className="h-5 w-5" /> Done</p>
          <p className="text-sm text-emerald-800">{result.name} ({formatBytes(result.size)})</p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <Button asChild size="lg"><a href={result.url} download={result.name}><Download className="h-4 w-4" /> Download</a></Button>
            <Button asChild variant="outline"><Link href={toolPath}>Start over</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MergeRunner(props: Props) {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner {...props} />
    </Suspense>
  );
}
