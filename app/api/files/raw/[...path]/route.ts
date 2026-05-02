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
    // Allocate a fresh ArrayBuffer (never SharedArrayBuffer) so TS's strict
    // BodyInit / BlobPart types accept the response body without a cast.
    const ab: ArrayBuffer = new ArrayBuffer(buf.byteLength);
    new Uint8Array(ab).set(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength));
    return new Response(ab, {
      headers: { "Content-Type": type, "Cache-Control": "private, max-age=60" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
