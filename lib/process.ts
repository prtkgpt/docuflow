import { prisma } from "@/lib/db";
import { saveBuffer, readByUrlOrName } from "@/lib/storage";

// Loads a file's bytes after enforcing ownership. Two acceptable cases:
//
//   1. file.userId is set and matches the caller's userId — the owner
//      is processing their own file.
//   2. file.userId is null (anonymous upload) — anyone with the fileId
//      can process it. cuids aren't unguessable, so this case is for
//      the public free-tier flow only; the upload→tool round-trip stays
//      within the user's own session in practice.
//
// Any other case throws "File not found" — same error whether the file
// doesn't exist OR the caller isn't the owner, so we don't leak existence.
export async function loadFile(fileId: string, callerUserId: string | null = null) {
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) throw new Error("File not found");

  if (file.userId && file.userId !== callerUserId) {
    // Owned file accessed by someone other than the owner. Treat as missing.
    throw new Error("File not found");
  }

  const buffer = await readByUrlOrName(file.url);
  return { file, buffer };
}

export async function persistOutput(opts: {
  userId: string | null;
  fileId: string;
  toolType: string;
  output: Uint8Array;
  outputName: string;
  mimeType?: string;
}) {
  const { userId, fileId, toolType, output, outputName } = opts;
  const stored = await saveBuffer(Buffer.from(output), outputName, opts.mimeType || "application/pdf");

  const processed = await prisma.processedFile.create({
    data: {
      userId,
      fileId,
      toolType,
      outputUrl: stored.url,
      outputSize: stored.size,
    },
  });
  await prisma.toolUsage.create({ data: { userId, toolType, fileId } });

  return { id: processed.id, url: stored.url, size: stored.size, name: outputName };
}
