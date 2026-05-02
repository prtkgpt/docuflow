import { NextRequest } from "next/server";
import { readLocal } from "@/lib/storage";
import path from "path";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  // Local storage only — for cloud providers the URL points at the provider directly.
  const safe = params.path.map((p) => path.basename(p)).join("/");
  try {
    const buf = await readLocal(safe);
    const ext = path.extname(safe).toLowerCase();
    const type =
      ext === ".pdf" ? "application/pdf" :
      ext === ".png" ? "image/png" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      "application/octet-stream";
    const blob = new Blob([new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)], { type });
    return new Response(blob, { headers: { "Cache-Control": "private, max-age=60" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
