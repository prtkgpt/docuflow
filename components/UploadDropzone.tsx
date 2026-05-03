"use client";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB
const ACCEPTED = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "image/jpeg",
  "image/png",
];

type Props = {
  redirectTo?: string;
  multiple?: boolean;
  className?: string;
  buttonLabel?: string;
};

export function UploadDropzone({ redirectTo = "/workspace", multiple = false, className = "", buttonLabel = "Choose file" }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const upload = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files);
      if (arr.length === 0) return;
      setError(null);

      for (const f of arr) {
        if (f.size > MAX_BYTES) {
          setError(`File too large: ${f.name} (max 100 MB)`);
          return;
        }
        if (ACCEPTED.length && !ACCEPTED.includes(f.type) && f.type !== "") {
          setError(`Unsupported type: ${f.type}`);
          return;
        }
      }

      setFile(arr[0]);
      setUploading(true);
      try {
        const ids: string[] = [];
        for (const f of arr) {
          const id = await uploadOne(f, (p) => setProgress(p));
          ids.push(id);
        }
        const sep = redirectTo.includes("?") ? "&" : "?";
        const target = `${redirectTo}${sep}fileId=${encodeURIComponent(ids[0])}${
          ids.length > 1 ? `&extras=${encodeURIComponent(ids.slice(1).join(","))}` : ""
        }`;
        router.push(target);
      } catch (err: any) {
        setError(err?.message || "Upload failed");
        setUploading(false);
      }
    },
    [router, redirectTo],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      <div
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF"
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-white hover:border-brand-400 hover:bg-slate-50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,application/pdf,image/*"
          multiple={multiple}
          onChange={(e) => e.target.files && upload(e.target.files)}
        />
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-700">
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-900">Drop your PDF here</p>
        <p className="text-sm text-slate-500">or click to upload</p>
        <p className="mt-2 text-xs text-slate-400">PDF, DOCX, JPG, PNG supported · Max file size: 100 MB</p>
        <div className="mt-5 flex justify-center">
          <Button type="button" size="lg" disabled={uploading}>
            {uploading ? "Uploading…" : buttonLabel}
          </Button>
        </div>

        {file && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-700">
            <FileText className="h-4 w-4 text-brand-600" />
            <span className="font-medium">{file.name}</span>
            <span className="text-slate-400">({formatBytes(file.size)})</span>
          </div>
        )}
        {uploading && (
          <div className="mt-3 mx-auto h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function uploadOne(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.onload = () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && res.id) resolve(res.id);
        else if (res.code === "PLAN_LIMIT_SIZE")
          reject(new Error(`${res.error} Upgrade your plan in /pricing to upload larger files.`));
        else reject(new Error(res.error || `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error("Invalid server response"));
      }
    };
    const fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
  });
}
