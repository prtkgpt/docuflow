"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Send, FileText, RotateCcw, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/components/UploadDropzone";

type Turn = { role: "user" | "assistant"; text: string; pages?: number[] };

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<{ originalName: string } | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
        if (data.code === "PLAN_REQUIRED") {
          throw new Error("Chat with PDF requires a Pro or Business plan. Upgrade in /pricing.");
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
    return <UploadDropzone redirectTo="/tools/chat-with-pdf" />;
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
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
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

export function InlineChatWithPdf() {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-slate-100" />}>
      <Inner />
    </Suspense>
  );
}
