"use client";
import Link from "next/link";
import { Undo2, Redo2, Download, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkspaceToolbar({
  fileName,
  onUndo,
  onRedo,
  onDownload,
  canDownload,
  onSave,
}: {
  fileName: string;
  onUndo?: () => void;
  onRedo?: () => void;
  onDownload?: () => void;
  canDownload?: boolean;
  onSave?: () => void;
}) {
  return (
    <div className="flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/" className="text-sm font-semibold text-brand-700">MyPDFKitty</Link>
        <span className="text-slate-300">/</span>
        <span className="truncate text-sm text-slate-700">{fileName}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onUndo} aria-label="Undo"><Undo2 className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={onRedo} aria-label="Redo"><Redo2 className="h-4 w-4" /></Button>
        <Button variant="outline" onClick={onSave}><Save className="h-4 w-4" /> Save</Button>
        <Button onClick={onDownload} disabled={!canDownload}><Download className="h-4 w-4" /> Download</Button>
        <Button asChild variant="secondary" className="bg-amber-100 text-amber-900 hover:bg-amber-200">
          <Link href="/pricing"><Sparkles className="h-4 w-4" /> Upgrade</Link>
        </Button>
      </div>
    </div>
  );
}
