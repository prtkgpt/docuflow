import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FileTable, type FileRow } from "@/components/FileTable";

export const dynamic = "force-dynamic";

async function getFiles(userId: string): Promise<FileRow[]> {
  try {
    const files = await prisma.file.findMany({
      where: { userId },
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
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?callbackUrl=/dashboard/files");
  const files = await getFiles(userId);
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
