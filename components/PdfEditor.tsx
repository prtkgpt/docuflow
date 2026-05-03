"use client";
import Link from "next/link";
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
  Hand,
  Circle,
  StickyNote,
  Link as LinkIcon,
  MoreHorizontal,
  LayoutGrid,
  Files,
  FileText,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Printer,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/UpgradeModal";
import { ManagePagesModal, type PageOpsState } from "@/components/ManagePagesModal";
import { getClientSession, type ClientSession } from "@/lib/session-client";
import type {
  Annotation,
  FontFamily,
  Align,
  TextAnnotation,
} from "@/lib/pdf/annotations";

type Tool =
  | "select"
  | "move"
  | "text"
  | "highlight"
  | "pencil"
  | "sign"
  | "check"
  | "cross"
  | "image"
  | "ellipse"
  | "note"
  | "link"
  | "eraser";

type Props = {
  fileUrl: string;
  fileId: string;
  fileName: string;
};

const TOOLS: { id: Tool; label: string; icon: any }[] = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "move", label: "Move", icon: Hand },
  { id: "text", label: "Add text", icon: TypeIcon },
  { id: "eraser", label: "Eraser", icon: Eraser },
  { id: "highlight", label: "Highlight", icon: Highlighter },
  { id: "pencil", label: "Pencil", icon: Pencil },
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "ellipse", label: "Ellipse", icon: Circle },
  { id: "cross", label: "Cross", icon: X },
  { id: "check", label: "Check", icon: Check },
  { id: "sign", label: "Sign", icon: PenTool },
  { id: "note", label: "Note", icon: StickyNote },
  { id: "link", label: "Link", icon: LinkIcon },
];

const COLORS = ["#111827", "#ef4444", "#2563eb", "#f59e0b", "#10b981", "#a855f7", "#ec4899"];
const FONTS: { id: FontFamily; label: string }[] = [
  { id: "helvetica", label: "Helvetica" },
  { id: "times", label: "Times" },
  { id: "courier", label: "Courier" },
];

type Interaction =
  | { kind: "create-rect"; id: string; startX: number; startY: number }
  | { kind: "create-pencil"; id: string }
  | { kind: "move"; id: string; offX: number; offY: number; orig: Annotation }
  | { kind: "resize"; id: string; corner: "nw" | "ne" | "sw" | "se"; orig: Annotation };

export function PdfEditor({ fileUrl, fileId, fileName }: Props) {
  const [pdf, setPdf] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.0);
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
  const [linkPrompt, setLinkPrompt] = useState<{ x: number; y: number } | null>(null);
  const [showPages, setShowPages] = useState(true);
  // Hide pages sidebar by default on small screens.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) setShowPages(false);
  }, []);
  const [showManagePages, setShowManagePages] = useState(false);
  const [pageOps, setPageOps] = useState<PageOpsState>({ order: [], rotations: {} });
  const [session, setSession] = useState<ClientSession>(null);
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null);
  const [layout, setLayout] = useState<"single" | "fit" | "two-up">("single");
  const [showSearch, setShowSearch] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHits, setSearchHits] = useState<{ page: number; text: string }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const interactionRef = useRef<Interaction | null>(null);

  // Load PDF + thumbnails
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
        setPageOps({ order: thumbs.map((_, i) => i + 1), rotations: {} });
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [fileUrl]);

  // Lightweight session probe so we know whether to show the email gate.
  useEffect(() => {
    let cancelled = false;
    getClientSession().then((s) => { if (!cancelled) setSession(s); });
    return () => { cancelled = true; };
  }, []);

  // Render active page. We include `loading` in deps so the effect re-runs
  // once the loading skeleton is replaced and the canvas mounts in the DOM.
  useEffect(() => {
    if (!pdf || loading || !canvasRef.current) return;
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
  }, [pdf, page, scale, loading]);

  // Keyboard delete / escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (editingTextId) return;
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
  function patchSelected(fn: (a: Annotation) => Annotation) {
    if (!selectedId) return;
    pushHistory(annotations.map((a) => (a.id === selectedId ? fn(a) : a)));
  }
  function commitInteraction() {
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(annotations);
    setHistory(trimmed);
    setHistoryIndex(trimmed.length - 1);
    interactionRef.current = null;
  }

  function rel(e: React.MouseEvent | MouseEvent) {
    const rect = overlayRef.current!.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  // Overlay handlers
  function onOverlayMouseDown(e: React.MouseEvent) {
    if (loading || pageSize.w === 0) return;
    setSelectedId(null);
    setEditingTextId(null);
    const { x, y } = rel(e);

    if (tool === "select" || tool === "move" || tool === "eraser") return;

    if (tool === "text") {
      const id = crypto.randomUUID();
      addAnnotation(
        {
          id,
          type: "text",
          page,
          x,
          y,
          text: "",
          fontSize,
          color,
          fontFamily: "helvetica",
          align: "left",
        },
        { startEditing: true },
      );
      return;
    }
    if (tool === "check" || tool === "cross") {
      addAnnotation({ id: crypto.randomUUID(), type: tool, page, x, y, size: 0.04, color });
      return;
    }
    if (tool === "note") {
      addAnnotation({ id: crypto.randomUUID(), type: "note", page, x, y, text: "Note", color });
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
    if (tool === "link") {
      setLinkPrompt({ x, y });
      return;
    }
    if (tool === "highlight") {
      const id = crypto.randomUUID();
      const a: Annotation = { id, type: "highlight", page, x, y, w: 0.001, h: 0.001, color };
      pushHistory([...annotations, a]);
      interactionRef.current = { kind: "create-rect", id, startX: x, startY: y };
      return;
    }
    if (tool === "ellipse") {
      const id = crypto.randomUUID();
      const a: Annotation = {
        id, type: "ellipse", page, x, y, w: 0.001, h: 0.001, color, fill: null, opacity: 1, borderWidth: 2,
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
        (a.type === "highlight" || a.type === "ellipse" || a.type === "image" || a.type === "signature" || a.type === "link")
          ? { ...a, x: Math.min(ia.startX, x), y: Math.min(ia.startY, y), w: Math.abs(x - ia.startX), h: Math.abs(y - ia.startY) }
          : a,
      );
      return;
    }
    if (ia.kind === "create-pencil") {
      updateAnnotation(ia.id, (a) => (a.type === "pencil" ? { ...a, points: [...a.points, [x, y]] } : a));
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

  function onAnnotationMouseDown(e: React.MouseEvent, a: Annotation) {
    e.stopPropagation();
    if (tool === "eraser") return deleteAnnotation(a.id);
    if (tool !== "select") return;
    setSelectedId(a.id);
    setEditingTextId(null);
    const { x, y } = rel(e);
    interactionRef.current = { kind: "move", id: a.id, offX: x, offY: y, orig: a };
  }
  function onResizeHandleMouseDown(e: React.MouseEvent, a: Annotation, corner: "nw" | "ne" | "sw" | "se") {
    e.stopPropagation();
    interactionRef.current = { kind: "resize", id: a.id, corner, orig: a };
  }

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
    addAnnotation({ id: crypto.randomUUID(), type: "image", page, x, y, w: 0.2, h: 0.15, dataUrl });
    e.target.value = "";
  }

  async function save() {
    // No email gate before download — the brief is explicit: don't put a
    // paywall before download for small files. Free anonymous users can
    // download. We still attach the result to a user account if the
    // session exists, so it shows up under My files.
    await runSave();
  }

  async function runSave() {
    setSaving(true);
    try {
      const cleaned = annotations.filter((a) => !(a.type === "text" && a.text.trim() === ""));
      // Only send pageOps when the user actually changed something
      const reordered = pageOps.order.length > 0 &&
        (pageOps.order.length !== thumbnails.length ||
          pageOps.order.some((p, i) => p !== i + 1) ||
          Object.values(pageOps.rotations).some((r) => r !== 0));
      const body: any = { fileId, annotations: cleaned };
      if (reordered) body.pageOps = { keep: pageOps.order, rotate: pageOps.rotations };

      const res = await fetch("/api/tools/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  async function runSearch(q: string) {
    setSearchQuery(q);
    if (!q.trim() || !pdf) return setSearchHits([]);
    const lower = q.toLowerCase();
    const hits: { page: number; text: string }[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const p = await pdf.getPage(i);
      const content = await p.getTextContent();
      const pageText = content.items.map((it: any) => ("str" in it ? it.str : "")).join(" ");
      const idx = pageText.toLowerCase().indexOf(lower);
      if (idx >= 0) {
        const start = Math.max(0, idx - 30);
        const end = Math.min(pageText.length, idx + q.length + 30);
        hits.push({ page: i, text: "…" + pageText.slice(start, end).trim() + "…" });
      }
    }
    setSearchHits(hits);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    } catch {
      alert("Could not copy link");
    }
  }

  const visible = useMemo(() => annotations.filter((a) => a.page === page), [annotations, page]);
  const total = pdf?.numPages ?? 0;
  const selected = useMemo(() => visible.find((a) => a.id === selectedId) || null, [visible, selectedId]);
  const isText = selected?.type === "text";

  return (
    <div className="flex h-screen flex-col bg-slate-100 select-none">
      {/* Top bar */}
      <div className="flex h-14 items-center gap-2 border-b border-slate-200 bg-white px-3 md:px-4">
        <Link href="/" className="text-sm font-semibold text-brand-700 shrink-0">MyPDFKitty</Link>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <span className="truncate text-sm text-slate-700 hidden sm:inline">{fileName}</span>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" aria-label="Search" title="Search" onClick={() => setShowSearch(true)}><Search className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Print" title="Print" onClick={() => window.print()} className="hidden sm:inline-flex"><Printer className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Download" title="Download" onClick={save}><Download className="h-4 w-4" /></Button>
        <Button variant="outline" onClick={share} className="hidden sm:inline-flex"><Share2 className="h-4 w-4" /> Share</Button>
        <Button onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          <span className="hidden sm:inline">{saving ? "Saving…" : "Done"}</span>
        </Button>
      </div>

      {/* Tool ribbon */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-1.5 overflow-x-auto">
        <RibbonButton active={showPages} onClick={() => setShowPages((s) => !s)} icon={Files} label="Pages" />
        <Divider />
        <RibbonButton onClick={undo} disabled={historyIndex <= 0} icon={Undo2} label="Undo" />
        <RibbonButton onClick={redo} disabled={historyIndex >= history.length - 1} icon={Redo2} label="Redo" />
        <Divider />
        {TOOLS.map((t) => (
          <RibbonButton
            key={t.id}
            active={tool === t.id}
            onClick={() => setTool(t.id)}
            icon={t.icon}
            label={t.label}
          />
        ))}
        <Divider />
        <RibbonButton onClick={() => setShowManagePages(true)} icon={LayoutGrid} label="Pages" />
        <RibbonButton
          onClick={() => {
            setLayout((l) => {
              const next = l === "single" ? "fit" : l === "fit" ? "two-up" : "single";
              if (next === "fit") setScale(1.2);
              else if (next === "two-up") setScale(0.7);
              else setScale(1.0);
              return next;
            });
          }}
          icon={FileText}
          label={layout === "single" ? "Single" : layout === "two-up" ? "Two-up" : "Fit width"}
        />
        <div className="relative">
          <RibbonButton onClick={() => setShowMoreMenu((m) => !m)} icon={MoreHorizontal} label="More" />
          {showMoreMenu && (
            <div className="absolute right-0 top-full z-30 mt-1 w-56 rounded-xl border border-slate-200 bg-white shadow-soft p-1 text-sm">
              {[
                { label: "Manage pages", onClick: () => { setShowMoreMenu(false); setShowManagePages(true); } },
                { label: "Find text", onClick: () => { setShowMoreMenu(false); setShowSearch(true); } },
                { label: "Reset all annotations", onClick: () => { setShowMoreMenu(false); pushHistory([]); } },
                { label: "Reset page order", onClick: () => { setShowMoreMenu(false); setPageOps({ order: thumbnails.map((_, i) => i + 1), rotations: {} }); } },
              ].map((it) => (
                <button
                  key={it.label}
                  onClick={it.onClick}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  {it.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contextual property bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 overflow-x-auto">
        {/* Color swatches always visible */}
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                if (selected && "color" in selected) {
                  patchSelected((a) => ({ ...(a as any), color: c }));
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

        {/* Text-specific controls */}
        {(tool === "text" || isText) && (
          <>
            <Divider />
            <select
              value={(selected as TextAnnotation | null)?.fontFamily ?? "helvetica"}
              onChange={(e) => {
                const v = e.target.value as FontFamily;
                if (isText) patchSelected((a) => ({ ...(a as TextAnnotation), fontFamily: v }));
              }}
              className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-sm"
            >
              {FONTS.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
            <input
              type="number"
              min={8}
              max={96}
              value={isText ? (selected as TextAnnotation).fontSize : fontSize}
              onChange={(e) => {
                const v = Math.max(8, Math.min(96, parseInt(e.target.value || "16", 10)));
                setFontSize(v);
                if (isText) patchSelected((a) => ({ ...(a as TextAnnotation), fontSize: v }));
              }}
              className="h-8 w-16 rounded-lg border border-slate-200 px-2 text-sm"
              title="Font size"
            />
            <Divider />
            <ToggleButton
              active={!!(selected as TextAnnotation | null)?.bold}
              onClick={() => isText && patchSelected((a) => ({ ...(a as TextAnnotation), bold: !(a as TextAnnotation).bold }))}
              icon={Bold}
            />
            <ToggleButton
              active={!!(selected as TextAnnotation | null)?.italic}
              onClick={() => isText && patchSelected((a) => ({ ...(a as TextAnnotation), italic: !(a as TextAnnotation).italic }))}
              icon={Italic}
            />
            <ToggleButton
              active={!!(selected as TextAnnotation | null)?.underline}
              onClick={() => isText && patchSelected((a) => ({ ...(a as TextAnnotation), underline: !(a as TextAnnotation).underline }))}
              icon={Underline}
            />
            <Divider />
            {(["left", "center", "right"] as Align[]).map((al) => {
              const Icon = al === "left" ? AlignLeft : al === "center" ? AlignCenter : AlignRight;
              return (
                <ToggleButton
                  key={al}
                  active={(selected as TextAnnotation | null)?.align === al}
                  onClick={() => isText && patchSelected((a) => ({ ...(a as TextAnnotation), align: al }))}
                  icon={Icon}
                />
              );
            })}
          </>
        )}

        {/* Shape opacity (highlight / ellipse) */}
        {selected && (selected.type === "highlight" || selected.type === "ellipse") && (
          <>
            <Divider />
            <span className="text-xs text-slate-500">Opacity</span>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round((selected.opacity ?? (selected.type === "highlight" ? 0.35 : 1)) * 100)}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10) / 100;
                patchSelected((a) => ({ ...(a as any), opacity: v }));
              }}
              className="w-28"
            />
          </>
        )}

        <div className="flex-1" />
        {selected && (
          <Button variant="outline" size="sm" onClick={() => deleteAnnotation(selected.id)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        )}
      </div>

      <div className="flex flex-1 min-h-0">
        {showPages && (
          <>
            {/* Mobile drawer overlay */}
            <div
              className="md:hidden fixed inset-0 bg-black/40 z-30"
              onClick={() => setShowPages(false)}
            />
            <aside className="fixed md:static z-40 md:z-auto top-0 left-0 h-full w-40 md:w-32 border-r border-slate-200 bg-white overflow-y-auto p-2 space-y-2">
              <button
                className="md:hidden w-full text-xs text-slate-500 hover:bg-slate-100 rounded-lg p-2 text-left"
                onClick={() => setShowPages(false)}
              >
                ← Close pages
              </button>
              {thumbnails.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i + 1); if (window.innerWidth < 768) setShowPages(false); }}
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
          </>
        )}

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
                    tool === "move" ? "cursor-grab" :
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
                        if (a.type === "text" && a.text.trim() === "") deleteAnnotation(a.id);
                        else commitInteraction();
                      }}
                      onDoubleClick={() => {
                        if ((a.type === "text" || a.type === "note") && tool === "select") setEditingTextId(a.id);
                      }}
                      onNoteChange={(text) => updateAnnotation(a.id, (cur) => (cur.type === "note" ? { ...cur, text } : cur))}
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

      {linkPrompt && (
        <LinkDialog
          onClose={() => setLinkPrompt(null)}
          onSubmit={(url) => {
            addAnnotation({
              id: crypto.randomUUID(),
              type: "link",
              page,
              x: linkPrompt.x,
              y: linkPrompt.y,
              w: 0.2,
              h: 0.04,
              url,
              color,
            });
            setLinkPrompt(null);
          }}
        />
      )}

      {showManagePages && (
        <ManagePagesModal
          thumbnails={thumbnails}
          state={pageOps.order.length > 0 ? pageOps : { order: thumbnails.map((_, i) => i + 1), rotations: {} }}
          onClose={() => setShowManagePages(false)}
          onApply={(next) => { setPageOps(next); setShowManagePages(false); }}
        />
      )}

      <UpgradeModal
        open={!!upgradeReason}
        onClose={() => setUpgradeReason(null)}
        reason={upgradeReason ?? undefined}
      />

      {showSearch && (
        <SearchModal
          q={searchQuery}
          hits={searchHits}
          onClose={() => setShowSearch(false)}
          onChange={runSearch}
          onJump={(p) => { setPage(p); setShowSearch(false); }}
        />
      )}
    </div>
  );
}

function SearchModal({
  q,
  hits,
  onChange,
  onClose,
  onJump,
}: {
  q: string;
  hits: { page: number; text: string }[];
  onChange: (q: string) => void;
  onClose: () => void;
  onJump: (page: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/40 p-4 pt-24">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold">Find in document</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search text…"
            className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm"
          />
          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
            {q.trim() && hits.length === 0 && <p className="text-sm text-slate-500">No matches.</p>}
            {hits.map((h, i) => (
              <button
                key={i}
                onClick={() => onJump(h.page)}
                className="block w-full text-left py-2 hover:bg-slate-50"
              >
                <div className="text-xs font-medium text-brand-700">Page {h.page}</div>
                <div className="text-sm text-slate-700 line-clamp-2">{h.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function RibbonButton({
  active,
  onClick,
  icon: Icon,
  label,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[11px] font-medium transition-colors min-w-[58px]",
        active ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-100",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ToggleButton({
  active,
  onClick,
  icon: Icon,
}: {
  active?: boolean;
  onClick: () => void;
  icon: any;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 w-8 grid place-items-center rounded-lg transition-colors",
        active ? "bg-brand-100 text-brand-800" : "text-slate-700 hover:bg-slate-100",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-7 w-px bg-slate-200" />;
}

// ---------------------------------------------------------------------------

function moveAnnotation(current: Annotation, orig: Annotation, dx: number, dy: number): Annotation {
  switch (orig.type) {
    case "text":
    case "check":
    case "cross":
    case "note":
      return { ...(current as any), x: clamp01(orig.x + dx), y: clamp01(orig.y + dy) };
    case "highlight":
    case "image":
    case "signature":
    case "ellipse":
    case "link":
      return { ...(current as any), x: clamp01(orig.x + dx), y: clamp01(orig.y + dy) };
    case "pencil":
      if (current.type !== "pencil") return current;
      return { ...current, points: orig.points.map(([x, y]) => [clamp01(x + dx), clamp01(y + dy)]) };
  }
}

function resizeAnnotation(
  current: Annotation,
  orig: Annotation,
  corner: "nw" | "ne" | "sw" | "se",
  x: number,
  y: number,
): Annotation {
  if (orig.type !== "highlight" && orig.type !== "image" && orig.type !== "signature" && orig.type !== "ellipse" && orig.type !== "link") return current;
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
  onNoteChange,
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
  onNoteChange: (text: string) => void;
}) {
  const px = (v: number) => v * pageSize.w;
  const py = (v: number) => v * pageSize.h;
  const cursor = tool === "select" ? "move" : tool === "eraser" ? "not-allowed" : "default";

  if (a.type === "text") {
    const fontPx = a.fontSize * (pageSize.w / 612);
    const family =
      a.fontFamily === "times" ? "'Times New Roman', Times, serif" :
      a.fontFamily === "courier" ? "'Courier New', Courier, monospace" :
      "Helvetica, Arial, sans-serif";
    const baseStyle: React.CSSProperties = {
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
      fontFamily: family,
      fontWeight: a.bold ? 700 : 400,
      fontStyle: a.italic ? "italic" : "normal",
      textDecoration: a.underline ? "underline" : "none",
      textAlign: a.align ?? "left",
      outline: editing ? "1px solid #3479ff" : selected ? "1px dashed #3479ff" : "none",
    };
    if (editing) {
      return (
        <input
          autoFocus
          value={a.text}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onTextBlur}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") (e.target as HTMLInputElement).blur(); }}
          style={baseStyle}
          placeholder="Type here…"
        />
      );
    }
    return (
      <div onMouseDown={onMouseDown} onDoubleClick={onDoubleClick} style={baseStyle}>
        {a.text || <span className="text-slate-300">Empty text</span>}
      </div>
    );
  }

  if (a.type === "highlight") {
    return (
      <RectFrame a={a} pageSize={pageSize} selected={selected} cursor={cursor} onMouseDown={onMouseDown} onResizeMouseDown={onResizeMouseDown}>
        <div style={{ width: "100%", height: "100%", background: a.color, opacity: a.opacity ?? 0.35 }} />
      </RectFrame>
    );
  }

  if (a.type === "ellipse") {
    return (
      <RectFrame a={a} pageSize={pageSize} selected={selected} cursor={cursor} onMouseDown={onMouseDown} onResizeMouseDown={onResizeMouseDown}>
        <svg width="100%" height="100%" viewBox={`0 0 ${px(a.w)} ${py(a.h)}`} preserveAspectRatio="none" style={{ pointerEvents: "none" }}>
          <ellipse
            cx={px(a.w) / 2}
            cy={py(a.h) / 2}
            rx={Math.max(0.5, px(a.w) / 2 - 1)}
            ry={Math.max(0.5, py(a.h) / 2 - 1)}
            stroke={a.color}
            strokeWidth={a.borderWidth ?? 2}
            fill={a.fill || "none"}
            opacity={a.opacity ?? 1}
          />
        </svg>
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
        className={cn("grid place-items-center", selected && "ring-2 ring-brand-500")}
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

  if (a.type === "note") {
    return (
      <div
        onMouseDown={onMouseDown}
        onDoubleClick={onDoubleClick}
        style={{
          position: "absolute",
          left: px(a.x),
          top: py(a.y),
          minWidth: 96,
          maxWidth: 220,
          padding: 6,
          background: "#fef9c3",
          color: a.color,
          border: `1px solid ${a.color}`,
          borderRadius: 6,
          fontSize: 12,
          cursor,
          outline: selected ? "1px dashed #3479ff" : "none",
        }}
      >
        {editing ? (
          <textarea
            autoFocus
            value={a.text}
            onChange={(e) => onNoteChange(e.target.value)}
            onBlur={onTextBlur}
            rows={3}
            className="block w-full bg-transparent outline-none resize-y"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-xs">{a.text}</pre>
        )}
      </div>
    );
  }

  if (a.type === "link") {
    return (
      <RectFrame a={a} pageSize={pageSize} selected={selected} cursor={cursor} onMouseDown={onMouseDown} onResizeMouseDown={onResizeMouseDown}>
        <div className="w-full h-full" style={{ borderBottom: `1px solid ${a.color}` }} title={a.url}>
          <span className="text-[10px]" style={{ color: a.color }}>{a.url}</span>
        </div>
      </RectFrame>
    );
  }

  if (a.type === "image" || a.type === "signature") {
    const isImg = a.type === "image" || (a.type === "signature" && a.dataUrl);
    return (
      <RectFrame a={a} pageSize={pageSize} selected={selected} cursor={cursor} onMouseDown={onMouseDown} onResizeMouseDown={onResizeMouseDown}>
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
  function endDraw() { drawingRef.current = false; }
  function clearCanvas() {
    const c = canvasRef.current; if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
  }

  return (
    <Modal title="Add signature" onClose={onClose}>
      <div className="px-5 pt-4">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          {(["type", "draw", "upload"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn("px-3 py-1.5 text-sm rounded-lg", tab === t ? "bg-white shadow-soft" : "text-slate-600")}
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
              const f = e.target.files?.[0]; if (!f) return;
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
    </Modal>
  );
}

function LinkDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (url: string) => void;
}) {
  const [url, setUrl] = useState("https://");
  return (
    <Modal title="Add link" onClose={onClose}>
      <div className="p-5 space-y-3">
        <label className="text-sm font-medium">URL</label>
        <input
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full h-10 rounded-xl border border-slate-200 px-3 text-sm"
          placeholder="https://example.com"
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSubmit(url.trim())}>Add link</Button>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className={cn("w-full rounded-2xl bg-white shadow-soft", wide ? "max-w-3xl" : "max-w-lg")}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
