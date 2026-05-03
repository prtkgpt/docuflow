"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Send, FileText, RotateCcw, MessagesSquare, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/components/UploadDropzone";

type Turn = { role: "user" | "assistant"; text: string; pages?: number[] };
type Usage = { signedIn: boolean; plan?: "free" | "pro" | "business"; used?: number; limit?: number };

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<{ originalName: string } | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/ai-usage?kind=chat").then((r) => r.json()).then(setUsage).catch(() => null);
  }, [turns.length]);

  useEffect(() => {
    if (!fileId) return;
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => setMeta(d.file ? { originalName: d.file.originalName } : null))
      .catch(() => null);
  }, [fileId]);

  async function ask(e?: React.FormEvent) {
    e?.preventDefault();
    if (!fileId || !q.trim()) return;
    const question = q.trim();
    setTurns((t) => [...t, { role: "user", text: question }]);
    setQ("");
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/tools/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, question }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "AUTH_REQUIRED") {
          router.push(`/login?callbackUrl=${encodeURIComponent(`/tools/chat-with-pdf?fileId=${fileId}`)}`);
          return;
        }
        if (data.code === "AI_TEXT_TOO_LONG" || data.code === "AI_DAILY_LIMIT" || data.code === "PLAN_REQUIRED") {
          throw new Error(data.error);
        }
        throw new Error(data.error || "Could not get an answer");
      }
      setTurns((t) => [...t, { role: "assistant", text: data.answer, pages: data.pages }]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }

  if (!fileId) {
    return (
      <div className="space-y-3">
        <UploadDropzone redirectTo="/tools/chat-with-pdf" />
        <UsageBadge usage={usage} />
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
            <p className="text-xs uppercase tracking-wide text-slate-500">Chatting with</p>
            <p className="truncate text-sm font-medium text-slate-900">{meta?.originalName ?? "Your PDF"}</p>
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/tools/chat-with-pdf"><RotateCcw className="h-4 w-4" /> New file</Link>
        </Button>
      </div>

      <UsageBadge usage={usage} />

      <div className="mt-4 max-h-96 min-h-[160px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
        {turns.length === 0 && (
          <div className="grid h-full place-items-center py-10 text-center text-sm text-slate-500">
            <MessagesSquare className="mx-auto h-6 w-6 text-slate-400" />
            <p className="mt-2">Ask a question to get started — for example:</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              <li>“What are the payment terms?”</li>
              <li>“Summarize the methodology in two sentences.”</li>
              <li>“List every dollar amount mentioned.”</li>
            </ul>
          </div>
        )}
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "text-right" : ""}>
            <div className={`inline-block max-w-[85%] rounded-2xl px-3 py-2 text-sm ${t.role === "user" ? "bg-brand-600 text-white" : "bg-white text-slate-800 border border-slate-200"}`}>
              <p className="whitespace-pre-wrap">{t.text}</p>
              {t.pages && t.pages.length > 0 && (
                <p className="mt-1 text-[11px] opacity-75">Pages: {t.pages.join(", ")}</p>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="text-left">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 space-y-2">
          <p>{error}</p>
          {(error.toLowerCase().includes("upgrade") || error.toLowerCase().includes("pro")) && (
            <div>
              <Button asChild size="sm"><Link href="/pricing"><Crown className="h-4 w-4" /> Upgrade to Pro</Link></Button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={ask} className="mt-3 flex gap-2">
        <Input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask a question about this PDF…"
          disabled={busy}
        />
        <Button type="submit" disabled={busy || !q.trim()}>
          <Send className="h-4 w-4" /> Ask
        </Button>
      </form>
    </div>
  );
}

function UsageBadge({ usage }: { usage: Usage | null }) {
  if (!usage || !usage.signedIn || !usage.plan) return null;
  if (usage.plan === "business") return null;
  const remaining = Math.max(0, (usage.limit ?? 0) - (usage.used ?? 0));
  const tone = remaining === 0 ? "border-amber-300 bg-amber-50 text-amber-900" : "border-slate-200 bg-slate-50 text-slate-600";
  return (
    <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${tone}`}>
      <span className="capitalize">{usage.plan}</span> plan · {usage.used} / {usage.limit} questions today
      {remaining === 0 && <Link href="/pricing" className="font-medium underline">Upgrade</Link>}
    </div>
  );
}

export function InlineChatWithPdf() {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner />
    </Suspense>
  );
}
