import { NextRequest } from "next/server";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { readLocal } from "@/lib/storage";

export const runtime = "nodejs";

// Local-storage file passthrough. Production typically uses Vercel Blob,
// so file.url points directly at https://...vercel-blob.com/... and never
// hits this route. But local dev and any non-blob deploy uses this path.
//
// Two-layer security model:
//
//   1. Storage paths include 128 bits of random entropy in the leading
//      segment (see lib/storage.ts) — equivalent to Vercel Blob's
//      unguessable URLs. This is the gate for anonymous uploads where
//      no ownership ACL exists.
//
//   2. Owned files (File.userId set) require a matching session. We
//      look up the File by storedName and refuse to serve unless the
//      caller is the owner.
//
// Pre-fix, this route served any local path with no ownership check.
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const safe = params.path.map((p) => path.basename(p)).join("/");
  if (!safe || safe.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  // Look up the File row by storedName (the path inside the local upload
  // dir). Strict equality — no wildcard match.
  const file = await prisma.file.findFirst({ where: { storedName: safe } });

  // If the file is owned by a user, require a matching session.
  if (file?.userId) {
    const session = await getServerSession(authOptions).catch(() => null);
    const callerId = (session?.user as { id?: string } | undefined)?.id;
    if (callerId !== file.userId) {
      // 404, not 403 — don't confirm existence to a non-owner.
      return new Response("Not found", { status: 404 });
    }
  }
  // Anonymous file (file?.userId is null/undefined) or no DB row at all:
  // fall through to the bytes. The unguessable 128-bit path is the gate.

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
