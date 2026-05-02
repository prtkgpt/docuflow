import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatBytes } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getStats() {
  // For the MVP we show aggregate stats (no auth wall yet on dashboard).
  try {
    const [fileCount, recent, toolUsage, totalSize] = await Promise.all([
      prisma.file.count(),
      prisma.file.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.toolUsage.groupBy({ by: ["toolType"], _count: { _all: true } }),
      prisma.file.aggregate({ _sum: { size: true } }),
    ]);
    return { fileCount, recent, toolUsage, totalSize: totalSize._sum.size || 0 };
  } catch {
    return { fileCount: 0, recent: [], toolUsage: [], totalSize: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-slate-600 text-sm">Welcome back to your DocuFlow workspace.</p>
        </div>
        <Button asChild><Link href="/#upload">Upload PDF</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Files uploaded</CardDescription>
            <CardTitle>{stats.fileCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Storage used</CardDescription>
            <CardTitle>{formatBytes(stats.totalSize)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Subscription</CardDescription>
            <CardTitle>Free</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm"><Link href="/pricing">Upgrade</Link></Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent files</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.recent.length === 0 && <p className="text-sm text-slate-500">No files yet.</p>}
            {stats.recent.map((f) => (
              <div key={f.id} className="flex justify-between items-center text-sm">
                <span className="truncate">{f.originalName}</span>
                <span className="text-slate-500 ml-2">{formatBytes(f.size)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tools used</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.toolUsage.length === 0 && <p className="text-sm text-slate-500">No usage yet.</p>}
            {stats.toolUsage.map((t) => (
              <div key={t.toolType} className="flex justify-between items-center text-sm">
                <span className="capitalize">{t.toolType}</span>
                <span className="text-slate-500">{t._count._all}×</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
