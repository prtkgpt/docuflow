import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

function startOfMonth(d = new Date()): Date {
  const x = new Date(d);
  x.setUTCDate(1);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}
function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

function fmtUsd(n: number): string {
  return `$${(Math.round(n * 100) / 100).toFixed(2)}`;
}

export default async function AdminAiCostPage() {
  const monthStart = startOfMonth();
  const dayStart = startOfDay();
  const last30 = new Date(dayStart);
  last30.setUTCDate(last30.getUTCDate() - 29);

  // Headline numbers — month + 24h
  const [monthAgg, dayAgg] = await Promise.all([
    prisma.aIUsage.aggregate({
      where: { createdAt: { gte: monthStart } },
      _sum: { inputTokens: true, outputTokens: true, estimatedCost: true },
      _count: { _all: true },
    }),
    prisma.aIUsage.aggregate({
      where: { createdAt: { gte: dayStart } },
      _sum: { inputTokens: true, outputTokens: true, estimatedCost: true },
      _count: { _all: true },
    }),
  ]);

  // Top spenders this month
  const topUsersRaw = await prisma.aIUsage.groupBy({
    by: ["userId"],
    where: { createdAt: { gte: monthStart } },
    _sum: { estimatedCost: true, inputTokens: true, outputTokens: true },
    _count: { _all: true },
    orderBy: { _sum: { estimatedCost: "desc" } },
    take: 20,
  });
  const userIds = topUsersRaw.map((u) => u.userId).filter(Boolean) as string[];
  const userRows = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true, name: true, subscription: { select: { plan: true } } },
  });
  const userById = Object.fromEntries(userRows.map((u) => [u.id, u]));

  // Last 30 days, bucketed (rough — fetch and bucket in JS to avoid DB-specific date functions)
  const recent = await prisma.aIUsage.findMany({
    where: { createdAt: { gte: last30 } },
    select: { createdAt: true, estimatedCost: true, featureType: true },
    orderBy: { createdAt: "asc" },
  });
  const buckets = new Map<string, { date: string; sum: number; calls: number }>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(last30);
    d.setUTCDate(d.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { date: key, sum: 0, calls: 0 });
  }
  for (const r of recent) {
    const key = r.createdAt.toISOString().slice(0, 10);
    const b = buckets.get(key);
    if (b) {
      b.sum += Number(r.estimatedCost);
      b.calls += 1;
    }
  }
  const series = Array.from(buckets.values());
  const peak = Math.max(...series.map((b) => b.sum), 0.001);

  // Recent activity table
  const recentRows = await prisma.aIUsage.findMany({
    orderBy: { createdAt: "desc" },
    take: 15,
    include: { user: { select: { email: true, name: true } } },
  });

  const monthCost = Number(monthAgg._sum.estimatedCost ?? 0);
  const dayCost = Number(dayAgg._sum.estimatedCost ?? 0);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AI cost dashboard</h1>
          <p className="text-sm text-slate-600">Per-user spend, model rates, and 30-day trend.</p>
        </div>
        <Link href="/master-admin" className="text-sm text-brand-700 hover:underline">← Back to admin</Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <KpiCard title="This month" value={fmtUsd(monthCost)} sub={`${monthAgg._count._all} calls`} />
        <KpiCard title="Last 24h" value={fmtUsd(dayCost)} sub={`${dayAgg._count._all} calls`} />
        <KpiCard
          title="Input tokens (mo)"
          value={(monthAgg._sum.inputTokens ?? 0).toLocaleString()}
          sub="incl. retrieval context"
        />
        <KpiCard
          title="Output tokens (mo)"
          value={(monthAgg._sum.outputTokens ?? 0).toLocaleString()}
          sub="capped per plan"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Spend per day (last 30 days)</CardTitle>
          <CardDescription>USD, summed across all users + features.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1 h-36">
            {series.map((b) => (
              <div key={b.date} className="flex-1 flex flex-col items-center justify-end gap-1" title={`${b.date}: ${fmtUsd(b.sum)} (${b.calls} calls)`}>
                <div
                  className="w-full bg-brand-500/80 hover:bg-brand-600 rounded-t-sm"
                  style={{ height: `${Math.max(2, (b.sum / peak) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            <span>{series[0]?.date.slice(5)}</span>
            <span>{series[Math.floor(series.length / 2)]?.date.slice(5)}</span>
            <span>{series[series.length - 1]?.date.slice(5)}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Top users this month</CardTitle>
          <CardDescription>Sorted by estimated AI cost.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">User</th>
                <th className="py-2 pr-3 font-medium">Plan</th>
                <th className="py-2 pr-3 font-medium">Calls</th>
                <th className="py-2 pr-3 font-medium">Input tok</th>
                <th className="py-2 pr-3 font-medium">Output tok</th>
                <th className="py-2 pr-3 font-medium text-right">Est. cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topUsersRaw.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-slate-500">No AI usage yet this month.</td></tr>
              )}
              {topUsersRaw.map((row) => {
                const u = row.userId ? userById[row.userId] : null;
                return (
                  <tr key={row.userId ?? "anon"}>
                    <td className="py-2 pr-3">
                      {u ? (
                        <span>
                          <span className="font-medium">{u.email}</span>
                          {u.name && <span className="text-slate-500"> · {u.name}</span>}
                        </span>
                      ) : (
                        <span className="text-slate-400">deleted user</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 capitalize">{u?.subscription?.plan ?? "free"}</td>
                    <td className="py-2 pr-3 tabular-nums">{row._count._all}</td>
                    <td className="py-2 pr-3 tabular-nums">{(row._sum.inputTokens ?? 0).toLocaleString()}</td>
                    <td className="py-2 pr-3 tabular-nums">{(row._sum.outputTokens ?? 0).toLocaleString()}</td>
                    <td className="py-2 pr-3 tabular-nums text-right font-semibold">{fmtUsd(Number(row._sum.estimatedCost ?? 0))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent AI calls</CardTitle>
          <CardDescription>Last 15 calls across the whole site.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Time (UTC)</th>
                <th className="py-2 pr-3 font-medium">User</th>
                <th className="py-2 pr-3 font-medium">Type</th>
                <th className="py-2 pr-3 font-medium">Model</th>
                <th className="py-2 pr-3 font-medium">Tokens</th>
                <th className="py-2 pr-3 font-medium text-right">Est. cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentRows.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-slate-500">No calls logged yet.</td></tr>
              )}
              {recentRows.map((r) => (
                <tr key={r.id}>
                  <td className="py-2 pr-3 tabular-nums text-slate-600">{r.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="py-2 pr-3">{r.user?.email ?? <span className="text-slate-400">—</span>}</td>
                  <td className="py-2 pr-3 capitalize">{r.featureType}</td>
                  <td className="py-2 pr-3 text-slate-600">{r.model}</td>
                  <td className="py-2 pr-3 tabular-nums">
                    <span className="text-slate-500">in</span> {r.inputTokens.toLocaleString()} ·{" "}
                    <span className="text-slate-500">out</span> {r.outputTokens.toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 tabular-nums text-right">{fmtUsd(Number(r.estimatedCost))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}

function KpiCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="text-xs uppercase tracking-wide">{title}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {sub && <CardContent className="pt-0 text-xs text-slate-500">{sub}</CardContent>}
    </Card>
  );
}
