import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Trash2, Cloud, KeyRound } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Security & Privacy | MyPDFKitty",
  description:
    "How MyPDFKitty handles your files: HTTPS uploads, account-isolated workspaces, delete-on-demand, and what we don't do.",
  path: "/security",
});

const POINTS = [
  { i: ShieldCheck, h: "HTTPS uploads", b: "All file uploads are sent over TLS to encrypted endpoints." },
  { i: Lock, h: "Account-isolated files", b: "Files are scoped to your account. Other users can't see them." },
  { i: KeyRound, h: "Per-plan limits", b: "We enforce per-plan size and quota limits at the API layer, not just the UI." },
  { i: EyeOff, h: "No selling your data", b: `${SITE.name} does not sell your files or your data to third parties.` },
  { i: Trash2, h: "Delete on demand", b: "Delete any file from /dashboard/files. Deletion is processed immediately." },
  { i: Cloud, h: "Cloud-native storage", b: "Files are stored on managed cloud storage with encryption at rest." },
];

export default function SecurityPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Security", path: "/security" }])} />
      <Header />
      <main className="container py-10 md:py-14 max-w-3xl">
        <Breadcrumbs items={[{ name: "Security", path: "/security" }]} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight">Security &amp; privacy</h1>
        <p className="mt-3 text-lg text-slate-700">
          {SITE.name} handles documents people care about. Here&apos;s how we protect them — described
          plainly, without overpromising.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {POINTS.map(({ i: Icon, h, b }) => (
            <div key={h} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <Icon className="h-5 w-5 text-brand-700" />
              <h2 className="mt-2 font-semibold">{h}</h2>
              <p className="mt-1 text-sm text-slate-700">{b}</p>
            </div>
          ))}
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">What we don&apos;t do</h2>
          <ul className="mt-3 list-disc pl-5 text-slate-700 space-y-1">
            <li>We don&apos;t share your files with advertisers or data brokers.</li>
            <li>We don&apos;t train AI models on your uploaded documents.</li>
            <li>We don&apos;t scan your documents for purposes outside what the tool requires.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Reporting an issue</h2>
          <p className="mt-2 text-slate-700">
            If you spot a security issue, please email us at{" "}
            <a href={`mailto:${SITE.email}`} className="text-brand-700 underline">{SITE.email}</a>{" "}
            with details so we can investigate.
          </p>
        </section>

        <section className="mt-10 rounded-2xl bg-brand-50 p-6 text-center">
          <h2 className="text-xl font-bold">Read the policies</h2>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild variant="outline"><Link href="/privacy">Privacy policy</Link></Button>
            <Button asChild variant="outline"><Link href="/terms">Terms of service</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
