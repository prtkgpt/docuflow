"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, FileText, Download, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { formatBytes } from "@/lib/utils";
import { asDownloadUrl } from "@/lib/download-url";

export type SimpleToolRunnerProps = {
  // Where this tool lives (used to build the redirect-after-upload URL).
  toolPath: string;          // e.g. "/tools/pdf-to-word"
  endpoint: string;          // e.g. "/api/tools/to-word"
  cta: string;               // "Convert to Word"
  busyLabel?: string;        // "Converting…"
  doneLabel?: string;        // "Your Word document is ready"
  acceptHint?: string;       // "PDF" or "JPG / PNG" — shown in the dropzone copy
  outputDisplayLabel?: (resp: ToolResponse, originalName: string) => string; // override label
};

type ToolResponse = {
  url: string;
  size: number;
  name?: string;
  originalSize?: number;
};

function Inner(props: SimpleToolRunnerProps) {
  const router = useRouter();
  const params = useSearchParams();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<{ originalName: string; size: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ToolResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => d.file && setMeta({ originalName: d.file.originalName, size: d.file.size }))
      .catch(() => null);
  }, [fileId]);

  async function run() {
    if (!fileId) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const res = await fetch(props.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "AUTH_REQUIRED") {
          router.push(`/login?callbackUrl=${encodeURIComponent(`${props.toolPath}?fileId=${fileId}`)}`);
          return;
        }
        if (data.code === "PLAN_REQUIRED") {
          throw new Error(`${data.error}. Upgrade in /pricing.`);
        }
        throw new Error(data.error || "Something went wrong");
      }
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!fileId) {
    return <UploadDropzone redirectTo={props.toolPath} />;
  }

  if (!meta) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-soft">
        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-500">File ready</p>
            <p className="truncate text-sm font-medium text-slate-900">{meta.originalName}</p>
            <p className="text-xs text-slate-500">{formatBytes(meta.size)}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={props.toolPath}><RotateCcw className="h-4 w-4" /> New file</Link>
        </Button>
      </div>

      {!result && (
        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={run} disabled={busy} size="lg" className="w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? props.busyLabel ?? "Working…" : props.cta}
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-emerald-900">{props.doneLabel ?? "Done!"}</p>
              <p className="text-sm text-emerald-800 truncate">
                {props.outputDisplayLabel
                  ? props.outputDisplayLabel(result, meta.originalName)
                  : `${result.name ?? "Your file"} (${formatBytes(result.size)}${result.originalSize ? ` — was ${formatBytes(result.originalSize)}` : ""})`}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="lg">
              <a href={asDownloadUrl(result.url, result.name)} download={result.name}>
                <Download className="h-4 w-4" /> Download
              </a>
            </Button>
            <Button variant="outline" onClick={() => { setResult(null); }}>Run again</Button>
            <Button asChild variant="ghost"><Link href={props.toolPath}>Try a new file</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SimpleToolRunner(props: SimpleToolRunnerProps) {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner {...props} />
    </Suspense>
  );
}
