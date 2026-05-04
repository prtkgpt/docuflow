import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";

// Storage abstraction so we can swap providers without changing call sites.
// Configure UPLOAD_STORAGE_PROVIDER in env: "local" | "vercel-blob" | "s3".
export type StoredFile = {
  storedName: string;
  url: string;
  size: number;
};

const provider = (process.env.UPLOAD_STORAGE_PROVIDER || "local").toLowerCase();
const LOCAL_DIR = path.join(process.cwd(), "uploads");

// Strip everything browsers/cloud storage might choke on, and cap length
// so storage paths stay reasonable.
function safeFilename(originalName: string, fallbackExt = ".bin"): string {
  const ext = path.extname(originalName) || fallbackExt;
  const stem = path
    .basename(originalName, ext)
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "file";
  return `${stem}${ext}`;
}

export async function saveBuffer(
  buffer: Buffer,
  originalName: string,
  mimeType = "application/pdf",
): Promise<StoredFile> {
  // We use a path of `<unique>/<readable-name>` so that when the file is
  // downloaded later, the browser uses the final segment as the suggested
  // filename. This way users see "invoice.pdf" instead of a UUID.
  //
  // The random portion is 32 hex chars (128 bits of entropy) so the path
  // itself is effectively unguessable — same security model as Vercel Blob
  // URLs. This matters for anonymous uploads where no ownership ACL exists;
  // the unguessable path is the security boundary.
  const unique = `${Date.now()}-${randomBytes(16).toString("hex")}`;
  const filename = safeFilename(originalName, mimeType.includes("pdf") ? ".pdf" : ".bin");
  const storedName = `${unique}/${filename}`;

  if (provider === "vercel-blob" && process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(storedName, buffer, {
      access: "public",
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: false,
    });
    return { storedName, url: blob.url, size: buffer.length };
  }

  // Local fallback for dev — write to disk under a per-file directory.
  const fullPath = path.join(LOCAL_DIR, storedName);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);
  return {
    storedName,
    url: `/api/files/raw/${storedName}`,
    size: buffer.length,
  };
}

export async function readLocal(storedName: string): Promise<Buffer> {
  // Allow nested paths like "<unique>/<filename>" but reject "../" segments.
  const normalized = path.normalize(storedName).replace(/^([./\\])+/, "");
  if (normalized.includes("..")) throw new Error("Invalid path");
  return fs.readFile(path.join(LOCAL_DIR, normalized));
}

export async function readByUrlOrName(urlOrName: string): Promise<Buffer> {
  if (urlOrName.startsWith("http://") || urlOrName.startsWith("https://")) {
    const res = await fetch(urlOrName);
    if (!res.ok) throw new Error(`Failed to fetch ${urlOrName}`);
    return Buffer.from(await res.arrayBuffer());
  }
  const name = urlOrName.replace(/^\/api\/files\/raw\//, "");
  return readLocal(name);
}
