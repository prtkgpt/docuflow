import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, FileSignature, Clock } from "lucide-react";
import { getEnvelopeQuota } from "@/lib/envelopes/quota";

export const dynamic = "force-dynamic";

export default async function EnvelopesPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?callbackUrl=/dashboard/envelopes");

  const [envelopes, quota] = await Promise.all([
    prisma.envelope.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: "desc" },
      include: {
        recipients: { select: { id: true, name: true, status: true } },
      },
      take: 100,
    }),
    getEnvelopeQuota(userId),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold inline-flex items-center gap-2">
            <FileSignature className="h-6 w-6 text-brand-600" /> Send for signature
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Send a PDF to one or more people for signing — like Docusign, but free up to 10 envelopes/month.
          </p>
        </div>
        <Button asChild disabled={quota.remaining <= 0}>
          <Link href="/dashboard/envelopes/new"><Plus className="h-4 w-4" /> New envelope</Link>
        </Button>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <span className="font-medium text-slate-900">{quota.used} / {quota.limit}</span>{" "}
        <span className="text-slate-600">envelopes used this month on your <span className="capitalize">{quota.plan}</span> plan.</span>{" "}
        {quota.remaining <= 0 && (
          <Link href="/pricing" className="text-brand-700 underline">Upgrade for more</Link>
        )}
      </div>

      {envelopes.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Recipients</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {envelopes.map((env) => (
                <tr key={env.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{env.subject}</td>
                  <td className="px-4 py-3"><StatusBadge status={env.status} /></td>
                  <td className="px-4 py-3 text-slate-700">
                    {env.recipients.map((r) => r.name).join(", ")}
                  </td>
                  <td className="px-4 py-3 text-slate-500 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {timeAgo(env.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/envelopes/${env.id}`} className="text-brand-700 underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
      <FileSignature className="mx-auto h-10 w-10 text-slate-300" />
      <h2 className="mt-3 text-lg font-semibold">No envelopes yet</h2>
      <p className="mt-1 text-sm text-slate-600">Upload a PDF, add recipients, and send it out for signature.</p>
      <Button asChild className="mt-4">
        <Link href="/dashboard/envelopes/new"><Plus className="h-4 w-4" /> Create your first envelope</Link>
      </Button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "bg-slate-100 text-slate-700",
    sent: "bg-blue-100 text-blue-800",
    viewed: "bg-amber-100 text-amber-800",
    completed: "bg-emerald-100 text-emerald-800",
    declined: "bg-red-100 text-red-800",
    voided: "bg-slate-100 text-slate-500 line-through",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${map[status] || map.draft}`}>
      {status}
    </span>
  );
}

function timeAgo(d: Date): string {
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
