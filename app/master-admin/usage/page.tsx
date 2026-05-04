import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/plans";

export const dynamic = "force-dynamic";

function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}
function startOfMonth(d = new Date()): Date {
  const x = startOfDay(d);
  x.setUTCDate(1);
  return x;
}
function daysAgo(n: number): Date {
  const x = startOfDay();
  x.setUTCDate(x.getUTCDate() - n);
  return x;
}

function planMonthlyUsd(plan: string): number {
  return PLANS.find((p) => p.id === plan)?.price.monthly ?? 0;
}

export default async function AdminUsagePage() {
  const dayStart = startOfDay();
  const monthStart = startOfMonth();
  const week = daysAgo(7);
  const month = daysAgo(30);

  const [
    totalUsers,
    newUsersMonth,
    newUsersToday,
    activeUsers7d,
    activeUsers30d,
    totalFiles,
    filesMonth,
    filesToday,
    totalToolUsage,
    toolUsageMonth,
    toolUsageToday,
    toolBreakdown,
    aiBreakdown,
    envCount,
    envByStatus,
    subBreakdown,
    recentSignups,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({ where: { createdAt: { gte: dayStart } } }),
    prisma.toolUsage.findMany({ where: { createdAt: { gte: week }, userId: { not: null } }, select: { userId: true }, distinct: ["userId"] }),
    prisma.toolUsage.findMany({ where: { createdAt: { gte: month }, userId: { not: null } }, select: { userId: true }, distinct: ["userId"] }),
    prisma.file.count(),
    prisma.file.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.file.count({ where: { createdAt: { gte: dayStart } } }),
    prisma.toolUsage.count(),
    prisma.toolUsage.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.toolUsage.count({ where: { createdAt: { gte: dayStart } } }),
    prisma.toolUsage.groupBy({
      by: ["toolType"],
      where: { createdAt: { gte: monthStart } },
      _count: { _all: true },
      orderBy: { _count: { toolType: "desc" } },
      take: 15,
    }),
    prisma.aIRequest.groupBy({
      by: ["requestType"],
      where: { createdAt: { gte: monthStart } },
      _count: { _all: true },
    }),
    prisma.envelope.count({ where: { deletedAt: null } }),
    prisma.envelope.groupBy({
      by: ["status"],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
    prisma.subscription.groupBy({
      by: ["plan"],
      _count: { _all: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        subscription: { select: { plan: true } },
      },
    }),
  ]);

  const subByPlan = new Map(subBreakdown.map((s) => [s.plan, s._count._all]));
  const planRows = PLANS.map((p) => ({
    plan: p.id,
    name: p.name,
    count: subByPlan.get(p.id) ?? 0,
    monthlyUsd: planMonthlyUsd(p.id),
  }));
  // Free is the implicit default, so include any user with no Subscription row.
  const subbedTotal = planRows.reduce((s, r) => s + r.count, 0);
  if (subbedTotal < totalUsers) {
    const freeRow = planRows.find((r) => r.plan === "free")!;
    freeRow.count += totalUsers - subbedTotal;
  }
  const mrrUsd = planRows.reduce((s, r) => s + r.count * r.monthlyUsd, 0);

  const envByStatusMap = new Map(envByStatus.map((e) => [e.status, e._count._all]));

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Site usage</h1>
          <p className="text-sm text-slate-600">Signups, traffic, file activity, subscriptions, and feature usage at a glance.</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/master-admin/ai-cost" className="text-brand-700 hover:underline">AI cost →</Link>
          <Link href="/master-admin" className="text-slate-600 hover:underline">← Back</Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <KpiCard title="Total users" value={fmtNum(totalUsers)} sub={`+${newUsersMonth} this month · +${newUsersToday} today`} />
        <KpiCard title="Active 7d" value={fmtNum(activeUsers7d.length)} sub={`${activeUsers30d.length} active in 30d`} />
        <KpiCard title="MRR (estimated)" value={`$${mrrUsd.toFixed(2)}`} sub={`from paid subscriptions`} />
        <KpiCard title="Envelopes" value={fmtNum(envCount)} sub={`${envByStatusMap.get("completed") ?? 0} completed`} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <KpiCard title="Files uploaded" value={fmtNum(totalFiles)} sub={`+${filesMonth} this month · +${filesToday} today`} />
        <KpiCard title="Tool runs (mo)" value={fmtNum(toolUsageMonth)} sub={`+${toolUsageToday} today · ${fmtNum(totalToolUsage)} all time`} />
        <KpiCard title="AI calls (mo)" value={fmtNum(aiBreakdown.reduce((s, b) => s + b._count._all, 0))} sub={aiBreakdown.map((b) => `${b._count._all} ${b.requestType}`).join(" · ") || "no calls yet"} />
        <KpiCard title="Pending signatures" value={fmtNum((envByStatusMap.get("sent") ?? 0) + (envByStatusMap.get("viewed") ?? 0))} sub={`${envByStatusMap.get("declined") ?? 0} declined · ${envByStatusMap.get("voided") ?? 0} voided`} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscribers by plan</CardTitle>
            <CardDescription>Count of active accounts per plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {planRows.map((r) => (
                  <tr key={r.plan}>
                    <td className="py-2">
                      <span className="font-medium">{r.name}</span>
                      {r.monthlyUsd > 0 && <span className="text-slate-500"> · ${r.monthlyUsd}/mo</span>}
                    </td>
                    <td className="py-2 text-right tabular-nums">{r.count}</td>
                    <td className="py-2 text-right tabular-nums text-slate-500">${(r.count * r.monthlyUsd).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="py-2">MRR</td>
                  <td />
                  <td className="py-2 text-right tabular-nums">${mrrUsd.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top tools this month</CardTitle>
            <CardDescription>Counts from ToolUsage logs.</CardDescription>
          </CardHeader>
          <CardContent>
            {toolBreakdown.length === 0 ? (
              <p className="text-sm text-slate-500">No tool usage logged yet.</p>
            ) : (
              <BarList rows={toolBreakdown.map((t) => ({ label: t.toolType, value: t._count._all }))} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Recent signups</CardTitle>
          <CardDescription>Latest 15 accounts.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500">
              <tr>
                <th className="py-2 pr-3 font-medium">Created</th>
                <th className="py-2 pr-3 font-medium">Email</th>
                <th className="py-2 pr-3 font-medium">Name</th>
                <th className="py-2 pr-3 font-medium">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSignups.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-slate-500">No users yet.</td></tr>
              ) : recentSignups.map((u) => (
                <tr key={u.id}>
                  <td className="py-2 pr-3 tabular-nums text-slate-600">{u.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
                  <td className="py-2 pr-3 font-medium">{u.email}</td>
                  <td className="py-2 pr-3 text-slate-600">{u.name ?? "—"}</td>
                  <td className="py-2 pr-3 capitalize">{u.subscription?.plan ?? "free"}</td>
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

function BarList({ rows }: { rows: { label: string; value: number }[] }) {
  const peak = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-1.5">
      {rows.map((r) => (
        <li key={r.label} className="text-sm">
          <div className="flex items-center justify-between">
            <span className="capitalize">{r.label.replace(/-/g, " ")}</span>
            <span className="tabular-nums text-slate-600">{r.value}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-brand-500" style={{ width: `${(r.value / peak) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function fmtNum(n: number): string {
  return n.toLocaleString();
}
