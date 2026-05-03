"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, FileText, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/components/UploadDropzone";

type Summary = {
  short: string;
  bullets: string[];
  takeaways: string[];
  actions: string[];
};

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<{ originalName: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const autoRan = params.get("autorun") === "1";

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => setMeta(d.file ? { originalName: d.file.originalName } : null))
      .catch(() => null);
  }, [fileId]);

  async function run() {
    if (!fileId) return;
    setBusy(true); setError(null); setSummary(null);
    try {
      const res = await fetch("/api/tools/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "AUTH_REQUIRED") {
          router.push(`/login?callbackUrl=${encodeURIComponent(`/tools/ai-pdf-summarizer?fileId=${fileId}`)}`);
          return;
        }
        if (data.code === "PLAN_REQUIRED") {
          throw new Error("AI summaries require a Pro or Business plan. Upgrade in /pricing.");
        }
        throw new Error(data.error || "Could not summarize");
      }
      setSummary(data.summary);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  // Auto-run once when ?autorun=1 is set (used by deep-links from upload).
  useEffect(() => {
    if (autoRan && fileId && !summary && !busy) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRan, fileId]);

  if (!fileId) {
    return <UploadDropzone redirectTo="/tools/ai-pdf-summarizer?autorun=1" />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 shrink-0">
            <FileText className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-slate-500">Loaded</p>
            <p className="truncate text-sm font-medium text-slate-900">{meta?.originalName ?? "Your PDF"}</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/tools/ai-pdf-summarizer"><RotateCcw className="h-4 w-4" /> New file</Link>
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={run} disabled={busy} size="lg">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {busy ? "Summarizing…" : summary ? "Re-run summary" : "Generate summary"}
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/editor?fileId=${fileId}`}>Open in editor</Link>
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {summary && (
        <div className="mt-6 space-y-5 text-sm">
          <Section title="Summary">{summary.short}</Section>
          {summary.bullets?.length > 0 && <ListSection title="Highlights" items={summary.bullets} />}
          {summary.takeaways?.length > 0 && <ListSection title="Key takeaways" items={summary.takeaways} />}
          {summary.actions?.length > 0 && <ListSection title="Action items" items={summary.actions} />}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-slate-800">{children}</p>
    </div>
  );
}
function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-800">
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    </div>
  );
}

export function InlineSummarizer() {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner />
    </Suspense>
  );
}
