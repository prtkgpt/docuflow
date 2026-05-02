"use client";
import { Scissors, Files as FilesIcon, RotateCw, Trash2, FileArchive, PenTool, Highlighter, Sparkles, MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export type WorkspaceTool = "merge" | "split" | "rotate" | "delete" | "compress" | "sign" | "annotate" | "summarize" | "chat";

const TOOLS: { id: WorkspaceTool; label: string; icon: any }[] = [
  { id: "merge", label: "Merge", icon: FilesIcon },
  { id: "split", label: "Split", icon: Scissors },
  { id: "rotate", label: "Rotate", icon: RotateCw },
  { id: "delete", label: "Delete pages", icon: Trash2 },
  { id: "compress", label: "Compress", icon: FileArchive },
  { id: "sign", label: "Sign", icon: PenTool },
  { id: "annotate", label: "Annotate", icon: Highlighter },
  { id: "summarize", label: "AI summarize", icon: Sparkles },
  { id: "chat", label: "Chat with PDF", icon: MessagesSquare },
];

export function WorkspaceSidebar({
  active,
  onSelect,
}: {
  active: WorkspaceTool;
  onSelect: (t: WorkspaceTool) => void;
}) {
  return (
    <aside className="w-56 border-r border-slate-200 bg-white">
      <div className="px-4 py-3 border-b border-slate-200">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tools</p>
      </div>
      <nav className="p-2 flex flex-col gap-1">
        {TOOLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active === id ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-100",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
