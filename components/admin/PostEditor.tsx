"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type PostFormValue = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  body: string;
  answer?: string;
  primaryToolHref?: string;
  primaryToolLabel?: string;
  relatedToolSlugs?: string;
  faqJson?: string;
  published: boolean;
};

const CATEGORIES = [
  "PDF editing",
  "PDF conversion",
  "AI PDF",
  "Business documents",
  "Student PDFs",
];

export function PostEditor({ initial }: { initial: PostFormValue }) {
  const router = useRouter();
  const [v, setV] = useState<PostFormValue>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNew = !v.id;

  function set<K extends keyof PostFormValue>(k: K, val: PostFormValue[K]) {
    setV((prev) => ({ ...prev, [k]: val }));
  }

  async function save(publish?: boolean) {
    setBusy(true);
    setError(null);
    try {
      const payload = { ...v, published: publish ?? v.published };
      const res = await fetch(isNew ? "/api/admin/posts" : `/api/admin/posts/${v.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/master-admin");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!v.id) return;
    if (!confirm("Delete this post?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/posts/${v.id}`, { method: "DELETE" });
      router.push("/master-admin");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Field label="Title">
          <Input value={v.title} onChange={(e) => set("title", e.target.value)} placeholder="How to compress a PDF online" />
        </Field>
        <Field label="Slug">
          <Input value={v.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} placeholder="how-to-compress-a-pdf-online" />
          <p className="text-xs text-slate-500 mt-1">URL: /blog/{v.slug || "your-slug"}</p>
        </Field>
        <Field label="Description (meta)">
          <textarea
            value={v.description}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Direct answer (2-4 sentences, surfaced as the quick-answer box)">
          <textarea
            value={v.answer || ""}
            onChange={(e) => set("answer", e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Body (plain text or simple Markdown-like content; rendered as paragraphs)">
          <textarea
            value={v.body}
            onChange={(e) => set("body", e.target.value)}
            rows={16}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono"
          />
        </Field>
        <Field label="FAQ JSON (array of {q, a})">
          <textarea
            value={v.faqJson || ""}
            onChange={(e) => set("faqJson", e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono"
            placeholder={`[{"q":"Question?","a":"Answer."}]`}
          />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <Field label="Category">
            <select
              value={v.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 px-2 text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={v.published} onChange={(e) => set("published", e.target.checked)} />
              Published (live on /blog)
            </label>
          </Field>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <Field label="Primary tool href">
            <Input value={v.primaryToolHref || ""} onChange={(e) => set("primaryToolHref", e.target.value)} placeholder="/tools/compress-pdf" />
          </Field>
          <Field label="Primary tool label">
            <Input value={v.primaryToolLabel || ""} onChange={(e) => set("primaryToolLabel", e.target.value)} placeholder="Compress PDF Online" />
          </Field>
          <Field label="Related tool slugs (comma-separated)">
            <Input value={v.relatedToolSlugs || ""} onChange={(e) => set("relatedToolSlugs", e.target.value)} placeholder="compress-pdf, merge-pdf" />
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => save(undefined)} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </Button>
          <Button variant="outline" onClick={() => save(true)} disabled={busy}>Publish</Button>
          {!isNew && (
            <>
              <a href={`/blog/${v.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                <Eye className="h-4 w-4" /> Preview
              </a>
              <Button variant="destructive" onClick={remove} disabled={busy}><Trash2 className="h-4 w-4" /> Delete</Button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="block text-sm">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
