"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EnvelopeData = {
  envelope: {
    id: string;
    subject: string;
    message: string | null;
    status: string;
    sender: { name: string | null; email: string };
    sourceName: string;
  };
  recipient: {
    id: string;
    name: string;
    email: string;
    status: string;
    signedAt: string | null;
  };
  fields: Field[];
};

type Field = {
  id: string;
  type: "signature" | "initials" | "date" | "text" | "checkbox";
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  value: string | null;
};

export function SigningClient({ token }: { token: string }) {
  const [data, setData] = useState<EnvelopeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageDims, setPageDims] = useState<{ pdfWidth: number; pdfHeight: number; renderWidth: number; renderHeight: number } | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<Field | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<"signed" | "declined" | null>(null);
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<any>(null);

  useEffect(() => {
    fetch(`/api/sign/${token}`)
      .then((r) => r.json().then((j) => ({ ok: r.ok, j })))
      .then(({ ok, j }) => {
        if (!ok) throw new Error(j.error || "Could not load document");
        setData(j);
        // Pre-fill any saved values (resume).
        const initial: Record<string, string> = {};
        j.fields.forEach((f: Field) => { if (f.value) initial[f.id] = f.value; });
        // Auto-fill date fields with today's date for convenience.
        j.fields.forEach((f: Field) => {
          if (f.type === "date" && !initial[f.id]) {
            initial[f.id] = new Date().toLocaleDateString();
          }
        });
        setValues(initial);
        if (j.recipient.status === "signed") setDone("signed");
        if (j.recipient.status === "declined") setDone("declined");
      })
      .catch((e: any) => setError(e.message));
  }, [token]);

  useEffect(() => {
    if (!data) return;
    let cancelled = false;
    (async () => {
      const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
      const loaded = await pdfjs.getDocument({ url: `/api/sign/${token}/source`, withCredentials: false }).promise;
      if (cancelled) return;
      pdfRef.current = loaded;
      setPageCount(loaded.numPages);
    })();
    return () => { cancelled = true; };
  }, [data, token]);

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

  const myFields = data?.fields || [];
  const requiredCount = myFields.filter((f) => f.required).length;
  const filledCount = myFields.filter((f) => f.required && values[f.id]).length;
  const allFilled = requiredCount > 0 && filledCount === requiredCount;

  function fieldStyle(f: Field): React.CSSProperties | null {
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

  function jumpToField(f: Field) {
    setPageNum(f.page);
    setActiveField(f);
  }

  async function submit() {
    if (!allFilled) return;
    setSubmitting(true); setError(null);
    try {
      const res = await fetch(`/api/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sign",
          fields: Object.entries(values).map(([id, value]) => ({ id, value })),
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Submit failed");
      setDone("signed");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function decline() {
    setSubmitting(true); setError(null);
    try {
      const res = await fetch(`/api/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline", reason: declineReason.trim() || undefined }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Decline failed");
      setDone("declined");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <XCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-2 text-sm font-medium text-red-700">{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid place-items-center py-20 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (done === "signed") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h1 className="mt-3 text-xl font-bold">Thanks, you&apos;re done!</h1>
        <p className="mt-2 text-sm text-slate-700">
          We&apos;ve recorded your signature on <span className="font-medium">{data.envelope.subject}</span>.
          Once everyone has signed, you&apos;ll get the final signed PDF by email.
        </p>
      </div>
    );
  }
  if (done === "declined") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <XCircle className="mx-auto h-10 w-10 text-slate-500" />
        <h1 className="mt-3 text-xl font-bold">You&apos;ve declined to sign</h1>
        <p className="mt-2 text-sm text-slate-700">
          We&apos;ve let {data.envelope.sender.name || data.envelope.sender.email} know.
        </p>
      </div>
    );
  }

  const senderLabel = data.envelope.sender.name || data.envelope.sender.email;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
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
          <span className="text-xs text-slate-500 truncate max-w-[50%]">{data.envelope.sourceName}</span>
        </div>
        <div className="overflow-auto p-4 max-h-[80vh]">
          <div className="relative inline-block bg-white shadow-soft">
            <canvas ref={canvasRef} className="block" />
            {myFields.map((f) => {
              const style = fieldStyle(f);
              if (!style) return null;
              const filled = !!values[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveField(f)}
                  style={{
                    ...style,
                    backgroundColor: filled ? "rgba(16,185,129,0.18)" : "rgba(31,92,242,0.18)",
                    border: `2px solid ${filled ? "#059669" : "#1f5cf2"}`,
                    borderRadius: 4,
                  }}
                  className="grid place-items-center text-[10px] font-medium uppercase text-slate-700 cursor-pointer overflow-hidden"
                  title={`${f.type}${f.required ? " (required)" : ""}`}
                >
                  {filled ? <FieldPreview field={f} value={values[f.id]} /> : f.type}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">From {senderLabel}</p>
          <h1 className="mt-1 text-lg font-bold">{data.envelope.subject}</h1>
          {data.envelope.message && (
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 border-l-2 border-brand-500 pl-3">
              {data.envelope.message}
            </p>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Signing as <span className="font-medium text-slate-900">{data.recipient.name}</span> ({data.recipient.email})
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Your fields</h2>
            <span className="text-xs text-slate-500">{filledCount} / {requiredCount}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: requiredCount ? `${(filledCount / requiredCount) * 100}%` : "0%" }} />
          </div>
          <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
            {myFields.map((f) => {
              const filled = !!values[f.id];
              return (
                <button
                  key={f.id}
                  onClick={() => jumpToField(f)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs flex items-center justify-between border ${filled ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                >
                  <span className="capitalize">{f.type} <span className="text-slate-400">· p{f.page}</span></span>
                  {filled ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <PenLine className="h-3.5 w-3.5 text-slate-400" />}
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={submit} disabled={!allFilled || submitting} className="w-full">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {submitting ? "Submitting…" : "Sign and finish"}
        </Button>
        <Button variant="outline" onClick={() => setShowDecline(true)} disabled={submitting} className="w-full">
          Decline to sign
        </Button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </aside>

      {activeField && (
        <FieldEditor
          field={activeField}
          signerName={data.recipient.name}
          initialValue={values[activeField.id] || ""}
          onCancel={() => setActiveField(null)}
          onSave={(v) => {
            setValues((prev) => ({ ...prev, [activeField.id]: v }));
            setActiveField(null);
          }}
        />
      )}

      {showDecline && (
        <Modal title="Decline to sign?" onClose={() => setShowDecline(false)}>
          <p className="text-sm text-slate-600">
            The sender will be notified and the document will be marked as declined.
          </p>
          <textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Reason (optional)"
            rows={3}
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDecline(false)} disabled={submitting}>Cancel</Button>
            <Button onClick={decline} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Decline
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function FieldPreview({ field, value }: { field: Field; value: string }) {
  if (!value) return null;
  if ((field.type === "signature" || field.type === "initials") && value.startsWith("data:image/")) {
    return <img src={value} alt="signature" className="max-h-full max-w-full object-contain" />;
  }
  if (field.type === "checkbox") return <span>{value === "true" ? "X" : ""}</span>;
  return <span className="truncate px-1 text-[11px] normal-case text-slate-900">{value}</span>;
}

function FieldEditor({
  field,
  signerName,
  initialValue,
  onCancel,
  onSave,
}: {
  field: Field;
  signerName: string;
  initialValue: string;
  onCancel: () => void;
  onSave: (v: string) => void;
}) {
  const [tab, setTab] = useState<"draw" | "type">(initialValue.startsWith("data:image/") ? "draw" : "type");
  const [typed, setTyped] = useState(initialValue.startsWith("data:image/") ? signerName : initialValue || signerName);
  const [text, setText] = useState(initialValue);
  const [checked, setChecked] = useState(initialValue === "true");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastDrawDataRef = useRef<string>("");

  if (field.type === "signature" || field.type === "initials") {
    return (
      <Modal title={field.type === "signature" ? "Add your signature" : "Add your initials"} onClose={onCancel}>
        <div className="flex gap-2 mb-3">
          <button onClick={() => setTab("type")} className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${tab === "type" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200"}`}>Type</button>
          <button onClick={() => setTab("draw")} className={`flex-1 rounded-lg border px-3 py-1.5 text-sm ${tab === "draw" ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-200"}`}>Draw</button>
        </div>

        {tab === "type" && (
          <div>
            <Input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type your name" />
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
              <span className="text-2xl italic text-slate-700" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                {typed || "Your signature"}
              </span>
            </div>
          </div>
        )}

        {tab === "draw" && (
          <SignaturePad canvasRef={canvasRef} drawing={drawing} onChange={(d) => { lastDrawDataRef.current = d; }} />
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            onClick={() => {
              if (tab === "type") {
                if (!typed.trim()) return;
                onSave(typed.trim());
              } else {
                const data = lastDrawDataRef.current;
                if (!data) return;
                onSave(data);
              }
            }}
          >
            Apply
          </Button>
        </div>
      </Modal>
    );
  }

  if (field.type === "checkbox") {
    return (
      <Modal title="Checkbox" onClose={onCancel}>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <span className="text-sm">Check this box</span>
        </label>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onSave(checked ? "true" : "false")}>Apply</Button>
        </div>
      </Modal>
    );
  }

  // text or date
  return (
    <Modal title={field.type === "date" ? "Date" : "Text"} onClose={onCancel}>
      <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={field.type === "date" ? "MM/DD/YYYY" : "Enter text"} />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => { if (text.trim()) onSave(text.trim()); }}>Apply</Button>
      </div>
    </Modal>
  );
}

function SignaturePad({
  canvasRef,
  drawing,
  onChange,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  drawing: React.MutableRefObject<boolean>;
  onChange: (dataUrl: string) => void;
}) {
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0d2b8c";
    ctx.lineWidth = 2.5;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
  }, [canvasRef]);

  function pos(e: React.MouseEvent | React.TouchEvent) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const point = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    return { x: (point.clientX - rect.left) * (c.width / rect.width), y: (point.clientY - rect.top) * (c.height / rect.height) };
  }

  function start(e: React.MouseEvent | React.TouchEvent) {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  function end() {
    drawing.current = false;
    const c = canvasRef.current;
    if (c) onChange(c.toDataURL("image/png"));
  }
  function clear() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, c.width, c.height);
    onChange("");
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={520}
        height={180}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        className="w-full rounded-xl border border-slate-200 bg-white touch-none"
      />
      <button onClick={clear} className="mt-2 text-xs text-slate-500 underline">Clear</button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold">{title}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
