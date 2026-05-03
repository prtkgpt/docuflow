import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatBytes } from "@/lib/utils";
import { getUserQuota } from "@/lib/quotas";
import { getPlan } from "@/lib/plans";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getStats(userId: string | null) {
  try {
    const where = userId ? { userId } : {};
    const [fileCount, recent, toolUsage, totalSize] = await Promise.all([
      prisma.file.count({ where }),
      prisma.file.findMany({ where, orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.toolUsage.groupBy({ where, by: ["toolType"], _count: { _all: true } }),
      prisma.file.aggregate({ where, _sum: { size: true } }),
    ]);
    return { fileCount, recent, toolUsage, totalSize: totalSize._sum.size || 0 };
  } catch {
    return { fileCount: 0, recent: [], toolUsage: [], totalSize: 0 };
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  if (!userId) redirect("/login?callbackUrl=/dashboard");
  const stats = await getStats(userId);
  const quota = await getUserQuota(userId);
  const plan = getPlan(quota.plan);
  const usagePct = Math.min(100, Math.round((quota.monthlyUsed / Math.max(1, quota.monthlyFiles)) * 100));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-slate-600 text-sm">Welcome back to your MyPDFKitty workspace.</p>
        </div>
        <Button asChild><Link href="/#upload">Upload PDF</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Plan</CardDescription>
            <CardTitle className="capitalize">{plan.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-slate-600">
              {quota.monthlyUsed} / {quota.monthlyFiles} files this month
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-brand-600" style={{ width: `${usagePct}%` }} />
            </div>
            {quota.plan !== "business" && (
              <Button asChild variant="outline" size="sm"><Link href="/pricing">Upgrade</Link></Button>
            )}
          </CardContent>
        </Card>
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
