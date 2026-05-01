import { prisma } from "@/lib/db";
import { saveBuffer, readByUrlOrName } from "@/lib/storage";

export async function loadFile(fileId: string) {
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) throw new Error("File not found");
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
