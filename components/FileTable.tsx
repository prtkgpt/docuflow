"use client";
import { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, formatDate } from "@/lib/utils";

export type FileRow = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  lastTool?: string | null;
};

export function FileTable({ initial }: { initial: FileRow[] }) {
  const [rows, setRows] = useState(initial);

  async function remove(id: string) {
    if (!confirm("Delete this file?")) return;
    const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
    if (res.ok) setRows((r) => r.filter((row) => row.id !== id));
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
        No files yet. Upload a PDF from the homepage to get started.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">File</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Size</th>
            <th className="px-4 py-3 font-medium">Uploaded</th>
            <th className="px-4 py-3 font-medium">Last tool</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 font-medium text-slate-900">{r.originalName}</td>
              <td className="px-4 py-3 text-slate-600">{r.mimeType.split("/")[1] || r.mimeType}</td>
              <td className="px-4 py-3 text-slate-600">{formatBytes(r.size)}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(r.createdAt)}</td>
              <td className="px-4 py-3 text-slate-600">{r.lastTool || "—"}</td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-1">
                  <Button asChild variant="ghost" size="icon">
                    <a href={r.url} download={r.originalName} aria-label="Download">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(r.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
