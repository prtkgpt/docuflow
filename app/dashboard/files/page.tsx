import { prisma } from "@/lib/db";
import { FileTable, type FileRow } from "@/components/FileTable";

export const dynamic = "force-dynamic";

async function getFiles(): Promise<FileRow[]> {
  try {
    const files = await prisma.file.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { usage: { take: 1, orderBy: { createdAt: "desc" } } },
    });
    return files.map((f) => ({
      id: f.id,
      originalName: f.originalName,
      mimeType: f.mimeType,
      size: f.size,
      url: f.url,
      createdAt: f.createdAt.toISOString(),
      lastTool: f.usage[0]?.toolType ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function FilesPage() {
  const files = await getFiles();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Files</h1>
        <p className="text-sm text-slate-600">Your recent uploads and processed PDFs.</p>
      </div>
      <FileTable initial={files} />
    </div>
  );
}
