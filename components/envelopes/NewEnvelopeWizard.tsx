"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Send, Upload, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Recipient = { tempId: string; name: string; email: string };

type FieldType = "signature" | "initials" | "date" | "text" | "checkbox";

type DraftField = {
  tempId: string;
  recipientTempId: string;
  type: FieldType;
  page: number;
  // Stored in PDF coordinate space (points, origin bottom-left).
  x: number;
  y: number;
  width: number;
  height: number;
};

type Step = "upload" | "recipients" | "fields";

const FIELD_DEFAULTS: Record<FieldType, { width: number; height: number; label: string }> = {
  signature: { width: 160, height: 40, label: "Signature" },
  initials:  { width: 60,  height: 36, label: "Initials" },
  date:      { width: 110, height: 22, label: "Date" },
  text:      { width: 140, height: 22, label: "Text" },
  checkbox:  { width: 18,  height: 18, label: "Checkbox" },
};

const RECIPIENT_COLORS = [
  { bg: "rgba(31,92,242,0.20)", border: "#1f5cf2" },
  { bg: "rgba(16,185,129,0.20)", border: "#059669" },
  { bg: "rgba(217,70,239,0.20)", border: "#a21caf" },
  { bg: "rgba(245,158,11,0.20)", border: "#b45309" },
  { bg: "rgba(244,63,94,0.20)", border: "#be123c" },
];

export function NewEnvelopeWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [fileId, setFileId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<Recipient[]>([
    { tempId: rid(), name: "", email: "" },
  ]);

  const [fields, setFields] = useState<DraftField[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addRecipient() {
    setRecipients((rs) => [...rs, { tempId: rid(), name: "", email: "" }]);
  }
  function updateRecipient(id: string, patch: Partial<Recipient>) {
    setRecipients((rs) => rs.map((r) => (r.tempId === id ? { ...r, ...patch } : r)));
  }
  function removeRecipient(id: string) {
    setRecipients((rs) => (rs.length > 1 ? rs.filter((r) => r.tempId !== id) : rs));
    setFields((fs) => fs.filter((f) => f.recipientTempId !== id));
  }

  function goRecipients() {
    setError(null);
    if (!fileId) return setError("Upload a PDF first.");
    setStep("recipients");
  }

  function goFields() {
    setError(null);
    if (!subject.trim()) return setError("Add a subject for the envelope.");
    if (recipients.some((r) => !r.name.trim() || !r.email.trim())) {
      return setError("Each recipient needs both a name and an email address.");
    }
    setStep("fields");
  }

  async function send() {
    setSubmitting(true); setError(null);
    try {
      // 1. Create envelope (creates recipients with permanent IDs).
      const createRes = await fetch("/api/envelopes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceFileId: fileId,
          subject: subject.trim(),
          message: message.trim() || undefined,
          recipients: recipients.map((r, idx) => ({
            name: r.name.trim(),
            email: r.email.trim(),
            order: idx + 1,
          })),
        }),
      });
      const created = await createRes.json();
      if (!createRes.ok) throw new Error(created.error || "Could not create envelope");

      // 2. Map our temp recipient IDs to the server-assigned IDs in field order.
      const tempIdToReal = new Map<string, string>();
      recipients.forEach((r, idx) => {
        const real = created.recipients?.[idx];
        if (real) tempIdToReal.set(r.tempId, real.id);
      });

      // 3. PATCH the fields onto the envelope.
      const patchRes = await fetch(`/api/envelopes/${created.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: fields.map((f) => ({
            recipientId: tempIdToReal.get(f.recipientTempId),
            type: f.type,
            page: f.page,
            x: f.x,
            y: f.y,
            width: f.width,
            height: f.height,
            required: true,
          })),
        }),
      });
      const patched = await patchRes.json();
      if (!patchRes.ok) throw new Error(patched.error || "Could not save fields");

      // 4. Fire send.
      const sendRes = await fetch(`/api/envelopes/${created.id}/send`, { method: "POST" });
      const sent = await sendRes.json();
      if (!sendRes.ok) throw new Error(sent.error || "Could not send envelope");

      router.push(`/dashboard/envelopes/${created.id}?just=sent`);
    } catch (e: any) {
      setError(e.message || "Send failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Stepper step={step} />

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {step === "upload" && (
        <div className="mt-6">
          <ManualUploader
            onUploaded={(id, name, url) => {
              setFileId(id);
              setFileName(name);
              setFileUrl(url);
              setStep("recipients");
            }}
          />
        </div>
      )}

      {step === "recipients" && (
        <div className="mt-6 grid gap-6 max-w-2xl">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='e.g. "NDA – ACME Corp"'
              maxLength={160}
            />
          </div>
          <div>
            <Label htmlFor="message">Message to recipients (optional)</Label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal note that appears in the invitation email."
              maxLength={2000}
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Recipients</Label>
              <Button type="button" variant="outline" size="sm" onClick={addRecipient}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {recipients.map((r, idx) => (
                <div key={r.tempId} className="grid grid-cols-[24px_1fr_1fr_auto] items-center gap-2">
                  <span
                    className="h-6 w-6 rounded-full text-xs font-bold text-white grid place-items-center"
                    style={{ backgroundColor: RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length].border }}
                  >
                    {idx + 1}
                  </span>
                  <Input
                    placeholder="Full name"
                    value={r.name}
                    onChange={(e) => updateRecipient(r.tempId, { name: e.target.value })}
                  />
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={r.email}
                    onChange={(e) => updateRecipient(r.tempId, { email: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeRecipient(r.tempId)}
                    disabled={recipients.length === 1}
                    aria-label="Remove recipient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep("upload")}>Back</Button>
            <Button onClick={goFields}>Next: place fields</Button>
          </div>
        </div>
      )}

      {step === "fields" && fileId && fileUrl && (
        <FieldPlacer
          fileUrl={fileUrl}
          fileName={fileName}
          recipients={recipients}
          fields={fields}
          setFields={setFields}
          onBack={() => setStep("recipients")}
          onSend={send}
          submitting={submitting}
        />
      )}
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "upload", label: "1. Upload" },
    { id: "recipients", label: "2. Recipients" },
    { id: "fields", label: "3. Fields & send" },
  ];
  const idx = steps.findIndex((s) => s.id === step);
  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <div key={s.id} className={`px-3 py-1.5 rounded-full ${i === idx ? "bg-brand-600 text-white" : i < idx ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {s.label}
        </div>
      ))}
    </div>
  );
}

function ManualUploader({ onUploaded }: { onUploaded: (id: string, name: string, url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Upload failed");
      // Resolve url so the field placer can render the PDF without a second fetch.
      const meta = await fetch(`/api/files?id=${data.id}`).then((r) => r.json());
      onUploaded(data.id, file.name, meta?.file?.url || "");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 cursor-pointer hover:border-brand-400">
      <Upload className="h-5 w-5 text-brand-600" />
      <span className="text-sm">{busy ? "Uploading…" : "Choose a PDF to send for signature"}</span>
      <input type="file" accept="application/pdf" className="hidden" onChange={handle} disabled={busy} />
      {err && <span className="text-xs text-red-600">{err}</span>}
    </label>
  );
}

function FieldPlacer({
  fileUrl,
  fileName,
  recipients,
  fields,
  setFields,
  onBack,
  onSend,
  submitting,
}: {
  fileUrl: string;
  fileName: string | null;
  recipients: Recipient[];
  fields: DraftField[];
  setFields: React.Dispatch<React.SetStateAction<DraftField[]>>;
  onBack: () => void;
  onSend: () => void;
  submitting: boolean;
}) {
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageDims, setPageDims] = useState<{ pdfWidth: number; pdfHeight: number; renderWidth: number; renderHeight: number } | null>(null);
  const [activeRecipient, setActiveRecipient] = useState<string>(recipients[0].tempId);
  const [activeType, setActiveType] = useState<FieldType>("signature");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<any>(null);

  const sourceUrl = fileUrl;

  // Load PDF once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
      const loaded = await pdfjs.getDocument({ url: sourceUrl, withCredentials: false }).promise;
      if (cancelled) return;
      pdfRef.current = loaded;
      setPageCount(loaded.numPages);
      setPageNum(1);
    })();
    return () => { cancelled = true; };
  }, [sourceUrl]);

  // Render current page.
  useEffect(() => {
    if (!pdfRef.current || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const p = await pdfRef.current.getPage(pageNum);
      const viewport = p.getViewport({ scale: 1.4 });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx || cancelled) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await p.render({ canvasContext: ctx, viewport }).promise;
      const orig = p.getViewport({ scale: 1 });
      setPageDims({
        pdfWidth: orig.width,
        pdfHeight: orig.height,
        renderWidth: viewport.width,
        renderHeight: viewport.height,
      });
    })();
    return () => { cancelled = true; };
  }, [pageNum, pageCount]);

  const colorByRecipient = useMemo(() => {
    const m = new Map<string, { bg: string; border: string }>();
    recipients.forEach((r, idx) => m.set(r.tempId, RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length]));
    return m;
  }, [recipients]);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!pageDims) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPx = e.clientX - rect.left;
    const yPx = e.clientY - rect.top;
    // Convert pixel → PDF points. Y axis flips (PDF origin = bottom-left).
    const scale = pageDims.renderWidth / pageDims.pdfWidth;
    const defaults = FIELD_DEFAULTS[activeType];
    const xPt = xPx / scale;
    const yPtTop = yPx / scale;
    const yPt = pageDims.pdfHeight - yPtTop - defaults.height;

    setFields((fs) => [
      ...fs,
      {
        tempId: rid(),
        recipientTempId: activeRecipient,
        type: activeType,
        page: pageNum,
        x: Math.max(0, xPt),
        y: Math.max(0, yPt),
        width: defaults.width,
        height: defaults.height,
      },
    ]);
  }

  function removeField(tempId: string) {
    setFields((fs) => fs.filter((f) => f.tempId !== tempId));
  }

  // Convert PDF coords → pixels for overlay rendering on the current page.
  function fieldStyle(f: DraftField): React.CSSProperties | null {
    if (!pageDims) return null;
    if (f.page !== pageNum) return null;
    const scale = pageDims.renderWidth / pageDims.pdfWidth;
    const left = f.x * scale;
    const top = (pageDims.pdfHeight - f.y - f.height) * scale;
    return {
      position: "absolute",
      left,
      top,
      width: f.width * scale,
      height: f.height * scale,
    };
  }

  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold">Signing for</h3>
          <p className="mt-1 text-xs text-slate-500">Pick a recipient, then click on the page to place a field for them.</p>
          <div className="mt-3 space-y-1">
            {recipients.map((r, idx) => {
              const c = RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length];
              const active = activeRecipient === r.tempId;
              return (
                <button
                  key={r.tempId}
                  onClick={() => setActiveRecipient(r.tempId)}
                  className={`w-full text-left rounded-xl px-3 py-2 text-sm border transition ${active ? "border-brand-500 bg-brand-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: c.border }} />
                    <span className="font-medium truncate">{r.name || `Signer ${idx + 1}`}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">{r.email}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold">Field type</h3>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {(Object.keys(FIELD_DEFAULTS) as FieldType[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`rounded-lg border px-2 py-1.5 text-xs capitalize ${activeType === t ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
              >
                {FIELD_DEFAULTS[t].label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold">Fields placed</h3>
          <p className="mt-1 text-xs text-slate-500">{fields.length} field{fields.length === 1 ? "" : "s"} total</p>
          <div className="mt-2 max-h-48 overflow-y-auto space-y-1 text-xs">
            {fields.length === 0 && <p className="text-slate-400">None yet — click on the page to add.</p>}
            {fields.map((f) => {
              const r = recipients.find((rr) => rr.tempId === f.recipientTempId);
              return (
                <div key={f.tempId} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1">
                  <span className="truncate">
                    <span className="capitalize">{f.type}</span> · p{f.page} · {r?.name || "?"}
                  </span>
                  <button onClick={() => removeField(f.tempId)} className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={onSend} disabled={submitting || fields.length === 0}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Sending…" : "Send envelope"}
          </Button>
          <Button variant="outline" onClick={onBack} disabled={submitting}>Back</Button>
        </div>
      </aside>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Button variant="outline" size="icon" disabled={pageNum <= 1} onClick={() => setPageNum((p) => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="tabular-nums">{pageNum} / {pageCount || "—"}</span>
            <Button variant="outline" size="icon" disabled={pageNum >= pageCount} onClick={() => setPageNum((p) => Math.min(pageCount, p + 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-xs text-slate-500 truncate">{fileName}</span>
        </div>
        <div className="overflow-auto p-4">
          <div ref={containerRef} className="relative inline-block bg-white shadow-soft" onClick={handleClick}>
            <canvas ref={canvasRef} className="block" />
            {fields.map((f) => {
              const style = fieldStyle(f);
              if (!style) return null;
              const c = colorByRecipient.get(f.recipientTempId)!;
              return (
                <div
                  key={f.tempId}
                  style={{
                    ...style,
                    backgroundColor: c.bg,
                    border: `2px solid ${c.border}`,
                    borderRadius: 4,
                    pointerEvents: "auto",
                  }}
                  onClick={(ev) => { ev.stopPropagation(); removeField(f.tempId); }}
                  title={`${FIELD_DEFAULTS[f.type].label} — click to remove`}
                  className="grid place-items-center text-[10px] font-medium uppercase text-slate-700 cursor-pointer"
                >
                  {FIELD_DEFAULTS[f.type].label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function rid(): string {
  return Math.random().toString(36).slice(2, 10);
}
