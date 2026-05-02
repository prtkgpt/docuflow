"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { WorkspaceSidebar, type WorkspaceTool } from "@/components/WorkspaceSidebar";
import { WorkspaceToolbar } from "@/components/WorkspaceToolbar";
import { PdfViewer } from "@/components/PdfViewer";
import { ToolSettingsPanel } from "@/components/ToolSettingsPanel";
import { UploadDropzone } from "@/components/UploadDropzone";

type FileMeta = { id: string; originalName: string; url: string; mimeType: string; size: number };

function WorkspaceInner() {
  const params = useSearchParams();
  const fileId = params.get("fileId");
  const extras = useMemo(() => (params.get("extras") || "").split(",").filter(Boolean), [params]);
  const initialTool = (params.get("tool") as WorkspaceTool) || "split";

  const [tool, setTool] = useState<WorkspaceTool>(initialTool);
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<{ url: string; size: number; toolType: string } | null>(null);

  useEffect(() => {
    if (!fileId) return;
    setLoading(true);
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => setMeta(d.file))
      .finally(() => setLoading(false));
  }, [fileId]);

  if (!fileId) {
    return (
      <main className="container py-16">
        <h1 className="text-2xl font-bold">Upload a PDF to start</h1>
        <p className="mt-1 text-slate-600">Drop a file below and we'll open it in the workspace.</p>
        <div className="mt-8 max-w-xl">
          <UploadDropzone redirectTo="/workspace" />
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <WorkspaceToolbar
        fileName={meta?.originalName || "Loading…"}
        canDownload={!!output}
        onDownload={() => output && window.open(output.url, "_blank")}
      />
      <div className="flex flex-1 min-h-0">
        <WorkspaceSidebar active={tool} onSelect={setTool} />
        <div className="flex-1 min-w-0 flex">
          <div className="flex-1 min-w-0">
            {loading || !meta ? (
              <div className="grid h-full place-items-center text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <PdfViewer src={meta.url} className="h-full" />
            )}
          </div>
          <div className="w-80 border-l border-slate-200 bg-white">
            <ToolSettingsPanel
              tool={tool}
              fileId={fileId}
              extras={extras}
              onProcessed={setOutput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={<div className="grid h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <WorkspaceInner />
    </Suspense>
  );
}
