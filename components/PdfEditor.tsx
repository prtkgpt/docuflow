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
  Trash2,
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

type Interaction =
  | { kind: "create-rect"; id: string; startX: number; startY: number }
  | { kind: "create-pencil"; id: string }
  | { kind: "move"; id: string; offX: number; offY: number; orig: Annotation }
  | { kind: "resize"; id: string; corner: "nw" | "ne" | "sw" | "se"; orig: Annotation };

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
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [history, setHistory] = useState<Annotation[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signPrompt, setSignPrompt] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const interactionRef = useRef<Interaction | null>(null);

  // Load PDF + thumbnails -------------------------------------------------
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
    return () => { cancelled = true; };
  }, [fileUrl]);

  // Render active page ----------------------------------------------------
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
    return () => { cancelled = true; };
  }, [pdf, page, scale]);

  // Keyboard delete / escape ---------------------------------------------
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (editingTextId) return; // let typing happen
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteAnnotation(selectedId);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, editingTextId]);

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
  function addAnnotation(a: Annotation, opts?: { startEditing?: boolean }) {
    pushHistory([...annotations, a]);
    setSelectedId(a.id);
    if (opts?.startEditing) setEditingTextId(a.id);
  }
  function deleteAnnotation(id: string) {
    pushHistory(annotations.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  }
  function updateAnnotation(id: string, patch: (a: Annotation) => Annotation) {
    setAnnotations((prev) => prev.map((a) => (a.id === id ? patch(a) : a)));
  }
  function commitInteraction() {
    // Snapshot the live annotations into history
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(annotations);
    setHistory(trimmed);
    setHistoryIndex(trimmed.length - 1);
    interactionRef.current = null;
  }

  // Coordinates -----------------------------------------------------------
  function rel(e: React.MouseEvent | MouseEvent) {
    const rect = overlayRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  // Overlay mouse handlers (creation + global drag) -----------------------
  function onOverlayMouseDown(e: React.MouseEvent) {
    if (loading || pageSize.w === 0) return;
    // Click on empty canvas always deselects (unless we're starting a creation)
    setSelectedId(null);
    setEditingTextId(null);

    const { x, y } = rel(e);
    if (tool === "select" || tool === "eraser") return;

    if (tool === "text") {
      const id = crypto.randomUUID();
      addAnnotation(
        { id, type: "text", page, x, y, text: "", fontSize, color },
        { startEditing: true },
      );
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
      setSignPrompt({ x, y });
      return;
    }
    if (tool === "highlight") {
      const id = crypto.randomUUID();
      const a: Annotation = {
        id, type: "highlight", page, x, y, w: 0.001, h: 0.001, color,
      };
      pushHistory([...annotations, a]);
      interactionRef.current = { kind: "create-rect", id, startX: x, startY: y };
      return;
    }
    if (tool === "pencil") {
      const id = crypto.randomUUID();
      const a: Annotation = { id, type: "pencil", page, points: [[x, y]], color, width: 2 };
      pushHistory([...annotations, a]);
      interactionRef.current = { kind: "create-pencil", id };
      return;
    }
  }

  function onOverlayMouseMove(e: React.MouseEvent) {
    const ia = interactionRef.current;
    if (!ia) return;
    const { x, y } = rel(e);

    if (ia.kind === "create-rect") {
      updateAnnotation(ia.id, (a) =>
        a.type === "highlight"
          ? {
              ...a,
              x: Math.min(ia.startX, x),
              y: Math.min(ia.startY, y),
              w: Math.abs(x - ia.startX),
              h: Math.abs(y - ia.startY),
            }
          : a,
      );
      return;
    }
    if (ia.kind === "create-pencil") {
      updateAnnotation(ia.id, (a) =>
        a.type === "pencil" ? { ...a, points: [...a.points, [x, y]] } : a,
      );
      return;
    }
    if (ia.kind === "move") {
      const dx = x - ia.offX;
      const dy = y - ia.offY;
      updateAnnotation(ia.id, (a) => moveAnnotation(a, ia.orig, dx, dy));
      return;
    }
    if (ia.kind === "resize") {
      updateAnnotation(ia.id, (a) => resizeAnnotation(a, ia.orig, ia.corner, x, y));
    }
  }

  function onOverlayMouseUp() {
    if (!interactionRef.current) return;
    commitInteraction();
  }

  // Annotation interactions (move + resize when in select mode) ----------
  function onAnnotationMouseDown(e: React.MouseEvent, a: Annotation) {
    e.stopPropagation();
    if (tool === "eraser") {
      deleteAnnotation(a.id);
      return;
    }
    if (tool !== "select") return;
    setSelectedId(a.id);
    setEditingTextId(null);
    const { x, y } = rel(e);
    interactionRef.current = {
      kind: "move",
      id: a.id,
      offX: x,
      offY: y,
      orig: a,
    };
  }

  function onResizeHandleMouseDown(
    e: React.MouseEvent,
    a: Annotation,
    corner: "nw" | "ne" | "sw" | "se",
  ) {
    e.stopPropagation();
    interactionRef.current = { kind: "resize", id: a.id, corner, orig: a };
  }

  // Image upload (placed at dataset coords) ------------------------------
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
      id: crypto.randomUUID(), type: "image", page, x, y, w: 0.2, h: 0.15, dataUrl,
    });
    e.target.value = "";
  }

  // Save -----------------------------------------------------------------
  async function save() {
    setSaving(true);
    try {
      const cleaned = annotations.filter(
        (a) => !(a.type === "text" && a.text.trim() === ""),
      );
      const res = await fetch("/api/tools/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, annotations: cleaned }),
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

  // ---------------------------------------------------------------------
  const visible = useMemo(() => annotations.filter((a) => a.page === page), [annotations, page]);
  const total = pdf?.numPages ?? 0;
  const selected = visible.find((a) => a.id === selectedId) || null;

  return (
    <div className="flex h-screen flex-col bg-slate-100 select-none">
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
              onClick={() => {
                setColor(c);
                if (selected && "color" in selected) {
                  pushHistory(annotations.map((a) => (a.id === selected.id ? ({ ...a, color: c } as Annotation) : a)));
                }
              }}
              aria-label={`Color ${c}`}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-transform",
                color === c ? "border-brand-600 scale-110" : "border-white",
              )}
              style={{ background: c }}
            />
          ))}
        </div>
        {(tool === "text" || (selected && selected.type === "text")) && (
          <>
            <div className="mx-2 h-8 w-px bg-slate-200" />
            <label className="text-xs text-slate-500">Size</label>
            <input
              type="number"
              min={8}
              max={72}
              value={selected && selected.type === "text" ? selected.fontSize : fontSize}
              onChange={(e) => {
                const v = parseInt(e.target.value || "16", 10);
                setFontSize(v);
                if (selected && selected.type === "text") {
                  pushHistory(annotations.map((a) => (a.id === selected.id && a.type === "text" ? { ...a, fontSize: v } : a)));
                }
              }}
              className="h-8 w-16 rounded-lg border border-slate-200 px-2 text-sm"
            />
          </>
        )}
        {selected && (
          <>
            <div className="mx-2 h-8 w-px bg-slate-200" />
            <Button variant="outline" size="sm" onClick={() => deleteAnnotation(selected.id)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
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
                    tool === "select" ? "cursor-default" :
                    tool === "eraser" ? "cursor-not-allowed" :
                    "cursor-crosshair",
                  )}
                  style={{ width: pageSize.w, height: pageSize.h }}
                >
                  {visible.map((a) => (
                    <AnnotationView
                      key={a.id}
                      a={a}
                      pageSize={pageSize}
                      tool={tool}
                      selected={selectedId === a.id}
                      editing={editingTextId === a.id}
                      onMouseDown={(e) => onAnnotationMouseDown(e, a)}
                      onResizeMouseDown={(e, c) => onResizeHandleMouseDown(e, a, c)}
                      onTextChange={(text) => updateAnnotation(a.id, (cur) => (cur.type === "text" ? { ...cur, text } : cur))}
                      onTextBlur={() => {
                        setEditingTextId(null);
                        if (a.type === "text" && a.text.trim() === "") {
                          deleteAnnotation(a.id);
                        } else {
                          commitInteraction();
                        }
                      }}
                      onDoubleClick={() => {
                        if (a.type === "text" && tool === "select") setEditingTextId(a.id);
                      }}
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
          onClose={() => setSignPrompt(null)}
          onSubmit={(payload) => {
            addAnnotation({
              id: crypto.randomUUID(),
              type: "signature",
              page,
              x: signPrompt.x,
              y: signPrompt.y,
              w: 0.25,
              h: 0.06,
              ...(payload.kind === "text" ? { text: payload.value } : { dataUrl: payload.value }),
            });
            setSignPrompt(null);
          }}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Move / resize math
// ---------------------------------------------------------------------------

function moveAnnotation(current: Annotation, orig: Annotation, dx: number, dy: number): Annotation {
  switch (orig.type) {
    case "text":
    case "check":
    case "cross":
      return { ...(current as any), x: clamp01(orig.x + dx), y: clamp01(orig.y + dy) };
    case "highlight":
    case "image":
    case "signature":
      return {
        ...(current as any),
        x: clamp01(orig.x + dx),
        y: clamp01(orig.y + dy),
      };
    case "pencil":
      if (current.type !== "pencil") return current;
      return {
        ...current,
        points: orig.points.map(([x, y]) => [clamp01(x + dx), clamp01(y + dy)]),
      };
  }
}

function resizeAnnotation(
  current: Annotation,
  orig: Annotation,
  corner: "nw" | "ne" | "sw" | "se",
  x: number,
  y: number,
): Annotation {
  if (orig.type !== "highlight" && orig.type !== "image" && orig.type !== "signature") return current;
  let { x: ox, y: oy, w: ow, h: oh } = orig as { x: number; y: number; w: number; h: number };
  let nx = ox, ny = oy, nw = ow, nh = oh;
  if (corner === "nw") { nw = ox + ow - x; nh = oy + oh - y; nx = x; ny = y; }
  if (corner === "ne") { nw = x - ox; nh = oy + oh - y; ny = y; }
  if (corner === "sw") { nw = ox + ow - x; nh = y - oy; nx = x; }
  if (corner === "se") { nw = x - ox; nh = y - oy; }
  if (nw < 0.005) nw = 0.005;
  if (nh < 0.005) nh = 0.005;
  return { ...(current as any), x: clamp01(nx), y: clamp01(ny), w: nw, h: nh };
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

// ---------------------------------------------------------------------------
// Annotation view (with selection chrome + resize handles)
// ---------------------------------------------------------------------------

function AnnotationView({
  a,
  pageSize,
  tool,
  selected,
  editing,
  onMouseDown,
  onResizeMouseDown,
  onTextChange,
  onTextBlur,
  onDoubleClick,
}: {
  a: Annotation;
  pageSize: { w: number; h: number };
  tool: Tool;
  selected: boolean;
  editing: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent, c: "nw" | "ne" | "sw" | "se") => void;
  onTextChange: (text: string) => void;
  onTextBlur: () => void;
  onDoubleClick: () => void;
}) {
  const px = (v: number) => v * pageSize.w;
  const py = (v: number) => v * pageSize.h;
  const cursor = tool === "select" ? "move" : tool === "eraser" ? "not-allowed" : "default";
  const ringClass = selected ? "ring-2 ring-brand-500" : "ring-0";

  if (a.type === "text") {
    const fontPx = a.fontSize * (pageSize.w / 612);
    const inputStyle: React.CSSProperties = {
      position: "absolute",
      left: px(a.x),
      top: py(a.y),
      color: a.color,
      fontSize: fontPx,
      lineHeight: 1.2,
      cursor,
      minWidth: 20,
      padding: "2px 4px",
      background: "transparent",
      border: "none",
      outline: editing ? "1px solid #3479ff" : selected ? "1px dashed #3479ff" : "none",
    };
    if (editing) {
      return (
        <input
          autoFocus
          value={a.text}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onTextBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "Escape") (e.target as HTMLInputElement).blur();
          }}
          style={inputStyle}
          placeholder="Type here…"
        />
      );
    }
    return (
      <div
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        style={inputStyle}
      >
        {a.text || <span className="text-slate-300">Empty text</span>}
      </div>
    );
  }

  if (a.type === "highlight") {
    return (
      <RectFrame
        a={a}
        pageSize={pageSize}
        selected={selected}
        cursor={cursor}
        onMouseDown={onMouseDown}
        onResizeMouseDown={onResizeMouseDown}
      >
        <div style={{ width: "100%", height: "100%", background: a.color, opacity: 0.35 }} />
      </RectFrame>
    );
  }

  if (a.type === "pencil") {
    if (a.points.length < 2) return null;
    const d = a.points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${px(x)} ${py(y)}`).join(" ");
    return (
      <svg
        className="absolute inset-0"
        width={pageSize.w}
        height={pageSize.h}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
      >
        {selected && <path d={d} stroke="#3479ff" strokeWidth={a.width + 6} fill="none" opacity={0.25} />}
        <path
          d={d}
          stroke={a.color}
          strokeWidth={a.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: "stroke", cursor }}
          onMouseDown={onMouseDown as any}
        />
      </svg>
    );
  }

  if (a.type === "check" || a.type === "cross") {
    const sz = a.size * pageSize.w;
    return (
      <div
        onMouseDown={onMouseDown}
        className={cn("grid place-items-center", ringClass)}
        style={{
          position: "absolute",
          left: px(a.x) - sz / 2,
          top: py(a.y) - sz / 2,
          width: sz,
          height: sz,
          color: a.color,
          fontSize: sz,
          lineHeight: 1,
          fontWeight: 800,
          cursor,
        }}
      >
        {a.type === "check" ? "✓" : "✕"}
      </div>
    );
  }

  if (a.type === "image" || a.type === "signature") {
    const isImg = a.type === "image" || (a.type === "signature" && a.dataUrl);
    return (
      <RectFrame
        a={a}
        pageSize={pageSize}
        selected={selected}
        cursor={cursor}
        onMouseDown={onMouseDown}
        onResizeMouseDown={onResizeMouseDown}
      >
        {isImg ? (
          <img src={(a as any).dataUrl} className="block w-full h-full object-contain pointer-events-none" alt="" />
        ) : (
          <span className="block w-full h-full italic text-blue-900" style={{ fontSize: py(a.h) * 0.7, lineHeight: `${py(a.h)}px` }}>
            {(a as any).text}
          </span>
        )}
      </RectFrame>
    );
  }
  return null;
}

function RectFrame({
  a,
  pageSize,
  selected,
  cursor,
  onMouseDown,
  onResizeMouseDown,
  children,
}: {
  a: Extract<Annotation, { w: number }>;
  pageSize: { w: number; h: number };
  selected: boolean;
  cursor: string;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent, c: "nw" | "ne" | "sw" | "se") => void;
  children: React.ReactNode;
}) {
  const px = (v: number) => v * pageSize.w;
  const py = (v: number) => v * pageSize.h;
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: px(a.x),
        top: py(a.y),
        width: px(a.w),
        height: py(a.h),
        cursor,
        outline: selected ? "1px dashed #3479ff" : "none",
      }}
    >
      {children}
      {selected && (["nw", "ne", "sw", "se"] as const).map((c) => (
        <div
          key={c}
          onMouseDown={(e) => onResizeMouseDown(e, c)}
          className="absolute h-2.5 w-2.5 rounded-sm bg-white border border-brand-500"
          style={{
            left: c.endsWith("w") ? -5 : "auto",
            right: c.endsWith("e") ? -5 : "auto",
            top: c.startsWith("n") ? -5 : "auto",
            bottom: c.startsWith("s") ? -5 : "auto",
            cursor: c === "nw" || c === "se" ? "nwse-resize" : "nesw-resize",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sign dialog
// ---------------------------------------------------------------------------

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
  function clearCanvas() {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
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
            <div className="space-y-2">
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
              <button onClick={clearCanvas} className="text-xs text-slate-500 hover:underline">Clear</button>
            </div>
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
