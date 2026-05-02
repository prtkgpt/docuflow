import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Storage abstraction so we can swap providers without changing call sites.
// Configure UPLOAD_STORAGE_PROVIDER in env: "local" | "vercel-blob" | "s3".
export type StoredFile = {
  storedName: string;
  url: string;
  size: number;
};

const provider = (process.env.UPLOAD_STORAGE_PROVIDER || "local").toLowerCase();
const LOCAL_DIR = path.join(process.cwd(), "uploads");

export async function saveBuffer(
  buffer: Buffer,
  originalName: string,
  mimeType = "application/pdf",
): Promise<StoredFile> {
  const ext = path.extname(originalName) || ".bin";
  const storedName = `${Date.now()}-${randomUUID()}${ext}`;

  if (provider === "vercel-blob" && process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(storedName, buffer, {
      access: "public",
      contentType: mimeType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return { storedName, url: blob.url, size: buffer.length };
  }

  // S3 hook: implement using @aws-sdk/client-s3 in production. The local
  // fallback below keeps the dev flow working without cloud credentials.
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  const fullPath = path.join(LOCAL_DIR, storedName);
  await fs.writeFile(fullPath, buffer);
  return {
    storedName,
    url: `/api/files/raw/${storedName}`,
    size: buffer.length,
  };
}

export async function readLocal(storedName: string): Promise<Buffer> {
  // Only used when provider === "local". For cloud providers, fetch via URL.
  const safe = path.basename(storedName);
  return fs.readFile(path.join(LOCAL_DIR, safe));
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
