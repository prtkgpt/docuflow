"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, FileText, Download, RotateCcw, Languages, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";
import { LANGUAGES, findLanguage, ENGLISH } from "@/lib/i18n/languages";

type Result = {
  from: string;
  to: string;
  fromName: string;
  toName: string;
  translated: string;
};

function Inner({ presetFrom, presetTo }: { presetFrom?: string; presetTo?: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const fileId = params.get("fileId");
  const initialFrom = presetFrom ?? params.get("from") ?? "auto";
  const initialTo = presetTo ?? params.get("to") ?? "en";

  const [meta, setMeta] = useState<{ originalName: string } | null>(null);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => d.file && setMeta({ originalName: d.file.originalName }))
      .catch(() => null);
  }, [fileId]);

  async function run() {
    if (!fileId) return;
    setBusy(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/tools/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, from, to }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "AUTH_REQUIRED") {
          router.push(`/login?callbackUrl=${encodeURIComponent(`/tools/translate-pdf?fileId=${fileId}`)}`);
          return;
        }
        throw new Error(data.error || "Translation failed");
      }
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  function downloadTxt(r: Result) {
    const blob = new Blob([r.translated], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(meta?.originalName || "translated").replace(/\.pdf$/i, "")}-${r.to}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!fileId) {
    return (
      <UploadDropzone
        redirectTo={`/tools/translate-pdf?from=${initialFrom}&to=${initialTo}`}
      />
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
            <p className="truncate text-sm font-medium">{meta?.originalName ?? "Your PDF"}</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/tools/translate-pdf"><RotateCcw className="h-4 w-4" /> New file</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <label htmlFor="from" className="text-sm font-medium">From</label>
          <select id="from" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
            <option value="auto">Auto-detect</option>
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:flex justify-center pb-2">
          <ArrowRight className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <label htmlFor="to" className="text-sm font-medium">To</label>
          <select id="to" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm">
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!result && (
        <Button size="lg" className="w-full" onClick={run} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
          {busy ? "Translating…" : `Translate to ${findLanguage(to)?.name ?? "English"}`}
        </Button>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 space-y-2">
          <p>{error}</p>
          {(error.toLowerCase().includes("upgrade") || error.toLowerCase().includes("plus") || error.toLowerCase().includes("limit")) && (
            <Button asChild size="sm"><Link href="/pricing"><Crown className="h-4 w-4" /> Upgrade</Link></Button>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {result.fromName} → {result.toName}
            </p>
            <pre className="mt-2 max-h-80 overflow-y-auto whitespace-pre-wrap font-sans text-sm text-slate-800">
              {result.translated}
            </pre>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => downloadTxt(result)}>
              <Download className="h-4 w-4" /> Download .txt
            </Button>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(result.translated)}>
              Copy translation
            </Button>
            <Button variant="ghost" onClick={() => setResult(null)}>Translate again</Button>
          </div>
          <p className="text-xs text-slate-500">
            PDF output that preserves layout is on the roadmap. For now, copy the text or download as .txt.
          </p>
        </div>
      )}
    </div>
  );
}

export function TranslateRunner({ presetFrom, presetTo }: { presetFrom?: string; presetTo?: string }) {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner presetFrom={presetFrom} presetTo={presetTo} />
    </Suspense>
  );
}
