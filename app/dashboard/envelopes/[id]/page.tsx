import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";
import { EnvelopeActions } from "@/components/envelopes/EnvelopeActions";
import { CheckCircle2, Clock, Download, Mail, XCircle, Eye, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EnvelopeDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { just?: string };
}) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect(`/login?callbackUrl=/dashboard/envelopes/${params.id}`);

  const envelope = await prisma.envelope.findFirst({
    where: { id: params.id, userId, deletedAt: null },
    include: {
      recipients: { orderBy: { order: "asc" } },
      events: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!envelope) notFound();

  const sourceFile = await prisma.file.findUnique({ where: { id: envelope.sourceFileId } });
  const signedFile = envelope.signedFileId
    ? await prisma.file.findUnique({ where: { id: envelope.signedFileId } })
    : null;

  const downloadName = `signed-${envelope.subject.replace(/[^\w.\- ]+/g, "").replace(/\s+/g, "-").slice(0, 60) || "document"}.pdf`;
  const downloadUrl = signedFile
    ? `${signedFile.url}${signedFile.url.includes("?") ? "&" : "?"}download=${downloadName}`
    : null;

  return (
    <div>
      <div className="text-sm">
        <Link href="/dashboard/envelopes" className="text-slate-500 hover:underline">← All envelopes</Link>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{envelope.subject}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Status: <span className="font-medium capitalize text-slate-900">{envelope.status}</span>
            {" · "}Created {envelope.createdAt.toLocaleString()}
          </p>
        </div>
        <EnvelopeActions
          envelopeId={envelope.id}
          status={envelope.status}
          canRemind={envelope.recipients.some((r) => r.status !== "signed" && r.status !== "declined")}
        />
      </div>

      {searchParams.just === "sent" && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✅ Envelope sent! Each recipient has been emailed a private signing link.
        </div>
      )}

      {downloadUrl && (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-center justify-between">
          <span>🎉 Everyone has signed. The final PDF is ready.</span>
          <a href={downloadUrl} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white">
            <Download className="h-4 w-4" /> Download
          </a>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recipients</h2>
          <ul className="mt-3 space-y-2">
            {envelope.recipients.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 p-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.name}</p>
                  <p className="text-xs text-slate-500 truncate">{r.email}</p>
                </div>
                <RecipientStatus status={r.status} />
              </li>
            ))}
          </ul>
          {envelope.status !== "completed" && envelope.status !== "voided" && (
            <details className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              <summary className="cursor-pointer font-medium text-slate-800">Signing links (private)</summary>
              <ul className="mt-2 space-y-1">
                {envelope.recipients.map((r) => (
                  <li key={r.id}>
                    <span className="font-medium">{r.name}:</span>{" "}
                    <code className="break-all">{absoluteUrl(`/sign/${r.signingToken}`)}</code>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-slate-500">Forward these only if a recipient lost their email.</p>
            </details>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Document</h2>
          <p className="mt-3 inline-flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-slate-400" />
            {sourceFile?.originalName || "—"}
          </p>
          {sourceFile && (
            <a href={sourceFile.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-brand-700 underline">
              View source PDF
            </a>
          )}
          {envelope.message && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">{envelope.message}</p>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Activity</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {envelope.events.map((e) => (
            <li key={e.id} className="flex items-center gap-2 text-slate-700">
              <EventIcon type={e.type} />
              <span className="capitalize">{e.type}</span>
              <span className="text-slate-400">· {e.createdAt.toLocaleString()}</span>
              {e.meta && <span className="text-slate-500">— {e.meta}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RecipientStatus({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; Icon: any }> = {
    pending:  { label: "Pending",  cls: "bg-slate-100 text-slate-700", Icon: Clock },
    sent:     { label: "Sent",     cls: "bg-blue-100 text-blue-800", Icon: Mail },
    viewed:   { label: "Viewed",   cls: "bg-amber-100 text-amber-800", Icon: Eye },
    signed:   { label: "Signed",   cls: "bg-emerald-100 text-emerald-800", Icon: CheckCircle2 },
    declined: { label: "Declined", cls: "bg-red-100 text-red-800", Icon: XCircle },
  };
  const m = map[status] || map.pending;
  const Icon = m.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      <Icon className="h-3 w-3" /> {m.label}
    </span>
  );
}

function EventIcon({ type }: { type: string }) {
  const map: Record<string, any> = {
    created: Clock,
    sent: Mail,
    viewed: Eye,
    signed: CheckCircle2,
    completed: CheckCircle2,
    declined: XCircle,
    reminded: Mail,
    voided: XCircle,
  };
  const Icon = map[type] || Clock;
  return <Icon className="h-3.5 w-3.5 text-slate-400" />;
}
