"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PdfEditor } from "@/components/PdfEditor";
import { UploadDropzone } from "@/components/UploadDropzone";

type FileMeta = { id: string; originalName: string; url: string };

function EditorInner() {
  const params = useSearchParams();
  const fileId = params.get("fileId");
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileId) return;
    setLoading(true);
    fetch(`/api/files?id=${fileId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setMeta(d.file);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [fileId]);

  if (!fileId) {
    return (
      <main className="container py-16">
        <h1 className="text-2xl font-bold">Open a PDF in the editor</h1>
        <p className="mt-1 text-slate-600">Drop a file below to start editing.</p>
        <div className="mt-8 max-w-xl">
          <UploadDropzone redirectTo="/editor" />
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="grid h-screen place-items-center text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (error || !meta) {
    return (
      <div className="grid h-screen place-items-center text-slate-700">
        <p>Could not load file. {error}</p>
      </div>
    );
  }
  return <PdfEditor fileUrl={meta.url} fileId={meta.id} fileName={meta.originalName} />;
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="grid h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <EditorInner />
    </Suspense>
  );
}
