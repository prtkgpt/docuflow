"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Type as TypeIcon,
  Highlighter,
  Pencil,
  PenTool,
  Check,
  X,
  Image as ImageIcon,
  Eraser,
  Undo2,
  Redo2,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  MousePointer2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Annotation } from "@/lib/pdf/annotations";

type Tool =
  | "select"
  | "text"
  | "highlight"
  | "pencil"
  | "sign"
  | "check"
  | "cross"
  | "image"
  | "eraser";

type Props = {
  fileUrl: string;
  fileId: string;
  fileName: string;
};

const TOOLS: { id: Tool; label: string; icon: any }[] = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "text", label: "Add text", icon: TypeIcon },
  { id: "highlight", label: "Highlight", icon: Highlighter },
  { id: "pencil", label: "Pencil", icon: Pencil },
  { id: "sign", label: "Sign", icon: PenTool },
  { id: "check", label: "Check", icon: Check },
  { id: "cross", label: "Cross", icon: X },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "eraser", label: "Eraser", icon: Eraser },
];

const COLORS = ["#111827", "#ef4444", "#2563eb", "#f59e0b", "#10b981"];

export function PdfEditor({ fileUrl, fileId, fileName }: Props) {
  const [pdf, setPdf] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.4);
  const [pageSize, setPageSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState(COLORS[0]);
  const [fontSize, setFontSize] = useState(16);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [history, setHistory] = useState<Annotation[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signPrompt, setSignPrompt] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the PDF once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const pdfjs: any = await import("pdfjs-dist/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";
      const loaded = await pdfjs.getDocument({ url: fileUrl }).promise;
      if (cancelled) return;
      setPdf(loaded);
      setPage(1);
      // Render thumbnails (small, sequentially to avoid spikes)
      const thumbs: string[] = [];
      for (let i = 1; i <= loaded.numPages; i++) {
        const p = await loaded.getPage(i);
        const vp = p.getViewport({ scale: 0.2 });
        const c = document.createElement("canvas");
        c.width = vp.width;
        c.height = vp.height;
        const ctx = c.getContext("2d");
        if (ctx) await p.render({ canvasContext: ctx, viewport: vp }).promise;
        thumbs.push(c.toDataURL("image/png"));
      }
      if (!cancelled) {
        setThumbnails(thumbs);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  // Render the active page
  useEffect(() => {
    if (!pdf || !canvasRef.current) return;
    let cancelled = false;
    (async () => {
      const p = await pdf.getPage(page);
      const viewport = p.getViewport({ scale });
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d");
      if (!ctx || cancelled) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setPageSize({ w: viewport.width, h: viewport.height });
      await p.render({ canvasContext: ctx, viewport }).promise;
    })();
    return () => {
      cancelled = true;
    };
  }, [pdf, page, scale]);

  function pushHistory(next: Annotation[]) {
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(next);
    setHistory(trimmed);
    setHistoryIndex(trimmed.length - 1);
    setAnnotations(next);
  }

  function undo() {
    if (historyIndex <= 0) return;
    const i = historyIndex - 1;
    setHistoryIndex(i);
    setAnnotations(history[i]);
    setSelectedId(null);
  }

  function redo() {
    if (historyIndex >= history.length - 1) return;
    const i = historyIndex + 1;
    setHistoryIndex(i);
    setAnnotations(history[i]);
    setSelectedId(null);
  }

  function addAnnotation(a: Annotation) {
    pushHistory([...annotations, a]);
    setSelectedId(a.id);
  }

  function deleteAnnotation(id: string) {
    pushHistory(annotations.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  // Mouse handlers ---------------------------------------------------------

  const dragRef = useRef<
    | null
    | {
        kind: "rect" | "pencil";
        startX: number;
        startY: number;
        currentId: string;
      }
  >(null);

  function rel(e: React.MouseEvent) {
    const rect = overlayRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  function onOverlayMouseDown(e: React.MouseEvent) {
    if (loading || pageSize.w === 0) return;
    const { x, y } = rel(e);

    if (tool === "select" || tool === "eraser") return;

    if (tool === "text") {
      const text = window.prompt("Enter text:", "");
      if (!text) return;
      addAnnotation({
        id: crypto.randomUUID(),
        type: "text",
        page,
        x,
        y,
        text,
        fontSize,
        color,
      });
      return;
    }

    if (tool === "check" || tool === "cross") {
      addAnnotation({
        id: crypto.randomUUID(),
        type: tool,
        page,
        x,
        y,
        size: 0.04,
        color,
      });
      return;
    }

    if (tool === "image") {
      fileInputRef.current?.setAttribute("data-x", String(x));
      fileInputRef.current?.setAttribute("data-y", String(y));
      fileInputRef.current?.click();
      return;
    }

    if (tool === "sign") {
      setSignPrompt(true);
      // store x/y in a ref-like attribute on the overlay
      overlayRef.current!.dataset.signX = String(x);
      overlayRef.current!.dataset.signY = String(y);
      return;
    }

    if (tool === "highlight") {
      const id = crypto.randomUUID();
      const a: Annotation = {
        id,
        type: "highlight",
        page,
        x,
        y,
        w: 0.001,
        h: 0.001,
        color,
      };
      pushHistory([...annotations, a]);
      dragRef.current = { kind: "rect", startX: x, startY: y, currentId: id };
      return;
    }

    if (tool === "pencil") {
      const id = crypto.randomUUID();
      const a: Annotation = {
        id,
        type: "pencil",
        page,
        points: [[x, y]],
        color,
        width: 2,
      };
      pushHistory([...annotations, a]);
      dragRef.current = { kind: "pencil", startX: x, startY: y, currentId: id };
      return;
    }
  }

  function onOverlayMouseMove(e: React.MouseEvent) {
    if (!dragRef.current) return;
    const { x, y } = rel(e);
    setAnnotations((prev) =>
      prev.map((a) => {
        if (a.id !== dragRef.current!.currentId) return a;
        if (a.type === "highlight" && dragRef.current!.kind === "rect") {
          const sx = dragRef.current!.startX;
          const sy = dragRef.current!.startY;
          return { ...a, x: Math.min(sx, x), y: Math.min(sy, y), w: Math.abs(x - sx), h: Math.abs(y - sy) };
        }
        if (a.type === "pencil" && dragRef.current!.kind === "pencil") {
          return { ...a, points: [...a.points, [x, y]] };
        }
        return a;
      }),
    );
  }

  function onOverlayMouseUp() {
    if (!dragRef.current) return;
    // Commit current state into history (we mutated annotations directly during drag)
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed[historyIndex] = annotations;
    trimmed.push(annotations);
    setHistory(trimmed);
    setHistoryIndex(trimmed.length - 1);
    dragRef.current = null;
  }

  function onAnnotationClick(e: React.MouseEvent, a: Annotation) {
    e.stopPropagation();
    if (tool === "eraser") {
      deleteAnnotation(a.id);
      return;
    }
    setSelectedId(a.id);
  }

  // Image upload (placed at the dataset coords)
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(f);
    });
    const x = parseFloat(fileInputRef.current?.dataset.x || "0.1");
    const y = parseFloat(fileInputRef.current?.dataset.y || "0.1");
    addAnnotation({
      id: crypto.randomUUID(),
      type: "image",
      page,
      x,
      y,
      w: 0.2,
      h: 0.15,
      dataUrl,
    });
    e.target.value = "";
  }

  // Save -------------------------------------------------------------------

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/tools/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, annotations }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      window.open(data.url, "_blank");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  // Render -----------------------------------------------------------------

  const visible = useMemo(() => annotations.filter((a) => a.page === page), [annotations, page]);
  const total = pdf?.numPages ?? 0;

  return (
    <div className="flex h-screen flex-col bg-slate-100">
      {/* Top toolbar */}
      <div className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4">
        <span className="text-sm font-semibold text-brand-700">DocuFlow</span>
        <span className="text-slate-300">/</span>
        <span className="truncate text-sm text-slate-700">{fileName}</span>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0} aria-label="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} aria-label="Redo">
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {saving ? "Saving…" : "Save & Download"}
        </Button>
      </div>

      {/* Tool ribbon */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-2 overflow-x-auto">
        {TOOLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTool(id)}
            title={label}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors min-w-[64px]",
              tool === id ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-100",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
        <div className="mx-2 h-8 w-px bg-slate-200" />
        <div className="flex items-center gap-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`Color ${c}`}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-transform",
                color === c ? "border-brand-600 scale-110" : "border-white",
              )}
              style={{ background: c }}
            />
          ))}
        </div>
        {tool === "text" && (
          <>
            <div className="mx-2 h-8 w-px bg-slate-200" />
            <label className="text-xs text-slate-500">Size</label>
            <input
              type="number"
              min={8}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value || "16", 10))}
              className="h-8 w-16 rounded-lg border border-slate-200 px-2 text-sm"
            />
          </>
        )}
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Pages sidebar */}
        <aside className="w-32 border-r border-slate-200 bg-white overflow-y-auto p-2 space-y-2">
          {thumbnails.map((src, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={cn(
                "block w-full rounded-lg border-2 overflow-hidden transition-colors",
                page === i + 1 ? "border-brand-500" : "border-slate-200 hover:border-slate-400",
              )}
            >
              <img src={src} alt={`Page ${i + 1}`} className="block w-full" />
              <div className="text-[11px] text-slate-500 py-1">Page {i + 1}</div>
            </button>
          ))}
        </aside>

        {/* Canvas + overlay */}
        <main className="flex-1 overflow-auto">
          <div className="flex justify-between items-center bg-white border-b border-slate-200 px-3 py-1.5 sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!pdf || page <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm tabular-nums text-slate-700">{pdf ? `${page} / ${total}` : "—"}</span>
              <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={!pdf || page >= total}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}><ZoomOut className="h-4 w-4" /></Button>
              <span className="text-xs text-slate-500 w-12 text-center">{Math.round(scale * 100)}%</span>
              <Button variant="outline" size="icon" onClick={() => setScale((s) => Math.min(3, s + 0.2))}><ZoomIn className="h-4 w-4" /></Button>
            </div>
          </div>

          {loading ? (
            <div className="grid place-items-center py-32 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="mt-2 text-sm">Loading PDF…</p>
            </div>
          ) : (
            <div className="p-8">
              <div
                className="relative mx-auto rounded-2xl bg-white shadow-soft"
                style={{ width: pageSize.w, height: pageSize.h }}
              >
                <canvas ref={canvasRef} className="block rounded-2xl" />
                <div
                  ref={overlayRef}
                  onMouseDown={onOverlayMouseDown}
                  onMouseMove={onOverlayMouseMove}
                  onMouseUp={onOverlayMouseUp}
                  onMouseLeave={onOverlayMouseUp}
                  className={cn(
                    "absolute inset-0",
                    tool !== "select" && tool !== "eraser" ? "cursor-crosshair" : "cursor-default",
                  )}
                  style={{ width: pageSize.w, height: pageSize.h }}
                >
                  {visible.map((a) => (
                    <AnnotationView
                      key={a.id}
                      a={a}
                      pageSize={pageSize}
                      selected={selectedId === a.id}
                      onClick={(e) => onAnnotationClick(e, a)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleImageUpload} />

      {signPrompt && (
        <SignDialog
          onClose={() => setSignPrompt(false)}
          onSubmit={(payload) => {
            const x = parseFloat(overlayRef.current?.dataset.signX || "0.1");
            const y = parseFloat(overlayRef.current?.dataset.signY || "0.1");
            addAnnotation({
              id: crypto.randomUUID(),
              type: "signature",
              page,
              x,
              y,
              w: 0.25,
              h: 0.06,
              ...(payload.kind === "text" ? { text: payload.value } : { dataUrl: payload.value }),
            });
            setSignPrompt(false);
          }}
        />
      )}
    </div>
  );
}

// ------------------------------ Annotation render --------------------------

function AnnotationView({
  a,
  pageSize,
  selected,
  onClick,
}: {
  a: Annotation;
  pageSize: { w: number; h: number };
  selected: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  const px = (v: number) => v * pageSize.w;
  const py = (v: number) => v * pageSize.h;

  if (a.type === "text") {
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          left: px(a.x),
          top: py(a.y),
          color: a.color,
          fontSize: a.fontSize * (pageSize.w / 612), // approx scale to viewport
          outline: selected ? "1px dashed #3479ff" : "none",
        }}
      >
        {a.text}
      </div>
    );
  }
  if (a.type === "highlight") {
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          left: px(a.x),
          top: py(a.y),
          width: px(a.w),
          height: py(a.h),
          background: a.color,
          opacity: 0.35,
          outline: selected ? "1px dashed #3479ff" : "none",
        }}
      />
    );
  }
  if (a.type === "pencil") {
    if (a.points.length < 2) return null;
    const d = a.points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${px(x)} ${py(y)}`).join(" ");
    return (
      <svg
        onClick={onClick}
        className="absolute inset-0 pointer-events-none"
        width={pageSize.w}
        height={pageSize.h}
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <path d={d} stroke={a.color} strokeWidth={a.width} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "stroke" }} />
        {selected && <path d={d} stroke="#3479ff" strokeWidth={a.width + 4} fill="none" opacity={0.2} />}
      </svg>
    );
  }
  if (a.type === "check" || a.type === "cross") {
    const sz = a.size * pageSize.w;
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          left: px(a.x) - sz / 2,
          top: py(a.y) - sz / 2,
          width: sz,
          height: sz,
          color: a.color,
          fontWeight: 800,
          outline: selected ? "1px dashed #3479ff" : "none",
        }}
        className="grid place-items-center"
      >
        {a.type === "check" ? "✓" : "✕"}
      </div>
    );
  }
  if (a.type === "image" || a.type === "signature") {
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          left: px(a.x),
          top: py(a.y),
          width: px(a.w),
          height: py(a.h),
          outline: selected ? "1px dashed #3479ff" : "none",
        }}
      >
        {a.type === "image" || (a.type === "signature" && a.dataUrl) ? (
          <img src={(a as any).dataUrl} className="block w-full h-full object-contain" alt="" />
        ) : (
          <span className="text-blue-900 italic" style={{ fontSize: pageSize.h * a.h * 0.7 }}>{(a as any).text}</span>
        )}
      </div>
    );
  }
  return null;
}

// ------------------------------ Sign dialog --------------------------------

function SignDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (p: { kind: "text" | "image"; value: string }) => void;
}) {
  const [tab, setTab] = useState<"type" | "draw" | "upload">("type");
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  function startDraw(e: React.MouseEvent) {
    drawingRef.current = true;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }
  function move(e: React.MouseEvent) {
    if (!drawingRef.current) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#0a2240";
    ctx.lineCap = "round";
    ctx.stroke();
  }
  function endDraw() {
    drawingRef.current = false;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold">Add signature</h3>
          <button onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 pt-4">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            {(["type", "draw", "upload"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg",
                  tab === t ? "bg-white shadow-soft" : "text-slate-600",
                )}
              >
                {t === "type" ? "Type" : t === "draw" ? "Draw" : "Upload"}
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 space-y-3">
          {tab === "type" && (
            <input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your name"
              className="w-full h-11 rounded-xl border border-slate-200 px-3 text-2xl italic text-blue-900"
            />
          )}
          {tab === "draw" && (
            <canvas
              ref={canvasRef}
              width={460}
              height={140}
              onMouseDown={startDraw}
              onMouseMove={move}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              className="w-full rounded-xl border border-slate-200 bg-slate-50"
            />
          )}
          {tab === "upload" && (
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const dataUrl: string = await new Promise((res, rej) => {
                  const r = new FileReader();
                  r.onload = () => res(r.result as string);
                  r.onerror = rej;
                  r.readAsDataURL(f);
                });
                onSubmit({ kind: "image", value: dataUrl });
              }}
            />
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (tab === "type") {
                if (!text.trim()) return;
                onSubmit({ kind: "text", value: text.trim() });
              } else if (tab === "draw") {
                const c = canvasRef.current!;
                onSubmit({ kind: "image", value: c.toDataURL("image/png") });
              }
            }}
          >
            Add signature
          </Button>
        </div>
      </div>
    </div>
  );
}
