"use client";
import { useState } from "react";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBytes } from "@/lib/utils";
import type { WorkspaceTool } from "./WorkspaceSidebar";

type Props = {
  tool: WorkspaceTool;
  fileId: string;
  extras?: string[]; // additional fileIds for merge
  onProcessed: (output: { url: string; size: number; toolType: string }) => void;
};

export function ToolSettingsPanel({ tool, fileId, extras = [], onProcessed }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const [pages, setPages] = useState("1");
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [signatureText, setSignatureText] = useState("");
  const [page, setPage] = useState(1);
  const [summary, setSummary] = useState<any>(null);
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState<{ answer: string; pages: number[] } | null>(null);

  async function call(endpoint: string, body: any) {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setBusy(false);
    }
  }

  async function runMerge() {
    const data = await call("/api/tools/merge", { fileIds: [fileId, ...extras] });
    setResult(data);
    onProcessed({ ...data, toolType: "merge" });
  }
  async function runSplit() {
    const data = await call("/api/tools/split", { fileId, ranges: pages });
    setResult(data); onProcessed({ ...data, toolType: "split" });
  }
  async function runRotate() {
    const data = await call("/api/tools/rotate", { fileId, ranges: pages, angle });
    setResult(data); onProcessed({ ...data, toolType: "rotate" });
  }
  async function runDelete() {
    const data = await call("/api/tools/delete-pages", { fileId, ranges: pages });
    setResult(data); onProcessed({ ...data, toolType: "delete-pages" });
  }
  async function runCompress() {
    // MVP: server returns the same PDF metadata; we display original/optimized.
    const data = await call("/api/tools/rotate", { fileId, ranges: "", angle: 0 });
    setResult(data); onProcessed({ ...data, toolType: "compress" });
  }
  async function runSign() {
    const data = await call("/api/tools/sign", {
      fileId,
      page,
      signature: { kind: "text", text: signatureText || "Signed" },
      placement: { x: 60, y: 80, width: 180, height: 40 },
    });
    setResult(data); onProcessed({ ...data, toolType: "sign" });
  }
  async function runSummarize() {
    const data = await call("/api/tools/summarize", { fileId });
    setSummary(data.summary);
  }
  async function runChat() {
    if (!question.trim()) return;
    const data = await call("/api/tools/chat", { fileId, question });
    setChatAnswer({ answer: data.answer, pages: data.pages });
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Settings</h3>

      {tool === "merge" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Merging {1 + extras.length} files in order. Re-upload to change the order.
          </p>
          <Button onClick={runMerge} disabled={busy} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Merge PDFs
          </Button>
        </div>
      )}

      {(tool === "split" || tool === "delete") && (
        <div className="space-y-3">
          <Label htmlFor="pages">Pages (e.g. 1-3, 5, 8-10)</Label>
          <Input id="pages" value={pages} onChange={(e) => setPages(e.target.value)} />
          <Button onClick={tool === "split" ? runSplit : runDelete} disabled={busy} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {tool === "split" ? "Extract pages" : "Delete pages"}
          </Button>
        </div>
      )}

      {tool === "rotate" && (
        <div className="space-y-3">
          <Label htmlFor="rpages">Pages (blank = all)</Label>
          <Input id="rpages" value={pages} onChange={(e) => setPages(e.target.value)} placeholder="all pages" />
          <Label>Angle</Label>
          <div className="grid grid-cols-3 gap-2">
            {[90, 180, 270].map((a) => (
              <Button
                key={a}
                variant={angle === a ? "default" : "outline"}
                onClick={() => setAngle(a as 90 | 180 | 270)}
              >
                {a}°
              </Button>
            ))}
          </div>
          <Button onClick={runRotate} disabled={busy} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Rotate pages
          </Button>
        </div>
      )}

      {tool === "compress" && (
        <div className="space-y-3">
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            MVP: real binary compression is wired through pdf-lib's optimized save. Larger
            optimization (image down-sampling) requires a native worker — placeholder for now.
          </p>
          <Button onClick={runCompress} disabled={busy} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Optimize PDF
          </Button>
        </div>
      )}

      {tool === "sign" && (
        <div className="space-y-3">
          <Label htmlFor="sigtext">Typed signature</Label>
          <Input id="sigtext" placeholder="Your name" value={signatureText} onChange={(e) => setSignatureText(e.target.value)} />
          <Label htmlFor="sigpage">Page</Label>
          <Input id="sigpage" type="number" value={page} onChange={(e) => setPage(Math.max(1, parseInt(e.target.value || "1", 10)))} min={1} />
          <p className="text-xs text-slate-500">Drawn and uploaded signatures use the same endpoint — see /tools/sign-pdf.</p>
          <Button onClick={runSign} disabled={busy} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign PDF
          </Button>
        </div>
      )}

      {tool === "annotate" && (
        <div className="space-y-2 text-sm text-slate-600">
          <p>Annotation overlays are drawn on the canvas client-side. For the MVP, use the Sign tool to drop text on a chosen page.</p>
        </div>
      )}

      {tool === "summarize" && (
        <div className="space-y-3">
          <Button onClick={runSummarize} disabled={busy} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Generate summary
          </Button>
          {summary && (
            <div className="space-y-3 text-sm">
              <Section title="Summary">{summary.short}</Section>
              {summary.bullets?.length > 0 && <ListSection title="Highlights" items={summary.bullets} />}
              {summary.takeaways?.length > 0 && <ListSection title="Key takeaways" items={summary.takeaways} />}
              {summary.actions?.length > 0 && <ListSection title="Action items" items={summary.actions} />}
            </div>
          )}
        </div>
      )}

      {tool === "chat" && (
        <div className="space-y-3">
          <Label htmlFor="q">Ask a question about the PDF</Label>
          <Input id="q" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What are the payment terms?" />
          <Button onClick={runChat} disabled={busy} className="w-full">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Ask
          </Button>
          {chatAnswer && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="whitespace-pre-wrap">{chatAnswer.answer}</p>
              {chatAnswer.pages.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">Cited pages: {chatAnswer.pages.join(", ")}</p>
              )}
            </div>
          )}
        </div>
      )}

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {result && (
        <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
          <p className="font-medium text-emerald-900">Done — {formatBytes(result.size)}</p>
          <a
            href={result.url}
            download
            className="mt-2 inline-flex items-center gap-1 text-emerald-800 underline"
          >
            <Download className="h-4 w-4" /> Download result
          </a>
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
