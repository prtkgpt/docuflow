import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, X, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { AffiliateLink } from "@/components/AffiliateLink";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { TipJar } from "@/components/TipJar";
import { findTool } from "@/lib/tools";
import { findPartner, isAffiliate } from "@/lib/affiliates";
import { ALTERNATIVES, findAlternative } from "@/lib/alternatives";
import {
  buildMetadata,
  breadcrumbLd,
  faqLd,
  softwareApplicationLd,
} from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return ALTERNATIVES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const a = findAlternative(params.slug);
  if (!a) return {};
  return buildMetadata({
    title: a.metaTitle,
    description: a.metaDescription,
    path: `/alternatives/${a.slug}`,
  });
}

export default function AlternativePage({ params }: { params: { slug: string } }) {
  const a = findAlternative(params.slug);
  if (!a) notFound();

  const path = `/alternatives/${a.slug}`;
  const breadcrumbs = [
    { name: "Alternatives", path: "/alternatives" },
    { name: `${a.competitor} alternative`, path },
  ];
  const related = a.relatedToolSlugs
    .map(findTool)
    .filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];

  const ld = [
    softwareApplicationLd({
      name: `MyPDFKitty — ${a.competitor} alternative`,
      description: a.metaDescription,
      url: absoluteUrl(path),
    }),
    breadcrumbLd(breadcrumbs),
    faqLd(a.faq),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr] items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-700">
              {a.competitor} alternative · {a.category}
            </p>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">{a.h1}</h1>
            <p className="mt-4 text-lg text-slate-700">{a.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg">
                <Link href={a.primaryCtaHref}>
                  {a.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              No credit card · Free tier covers most everyday use · Cancel any time
            </p>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              At a glance
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Box label={SITE.name} highlight>
                <p>From <strong>$0</strong></p>
                <p>Plus: <strong>$2.99/mo</strong></p>
              </Box>
              <Box label={a.competitor}>
                <p className="text-slate-600">{a.competitorPricingNote.split(".")[0]}.</p>
              </Box>
            </div>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Browser-only — no install</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>25+ tools in one subscription</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Free signing envelopes (10/mo)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>AI summary + chat included</span>
              </li>
            </ul>
          </aside>
        </div>

        {/* Why people switch */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight">Why people switch from {a.competitor}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {a.switchReasons.map((r) => (
              <div key={r.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Side-by-side table */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight">
            {SITE.name} vs {a.competitor}
          </h2>
          <p className="mt-2 text-slate-600">Side-by-side feature and pricing comparison.</p>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Feature</th>
                  <th className="px-4 py-3 font-semibold text-brand-700 bg-brand-50">{SITE.name}</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">{a.competitor}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {a.table.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-4 py-3 font-medium text-slate-900">{row.feature}</td>
                    <td className="px-4 py-3 bg-brand-50/40">{row.us}</td>
                    <td className="px-4 py-3 text-slate-700">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {a.competitorPricingNote}
          </p>
        </section>

        {/* When they're still better — fairness section */}
        <section className="mt-16">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-2xl font-bold inline-flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-slate-600" />
              When {a.competitor} is still the right choice
            </h2>
            <p className="mt-2 text-slate-700">
              We're not for everyone. Here are the cases where you should stick with {a.competitor}:
            </p>
            <ul className="mt-4 space-y-2">
              {a.whenTheyAreBetter.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm text-slate-700">
                  <X className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA mid-page */}
        <section className="mt-16 rounded-3xl bg-brand-600 p-8 md:p-10 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Try MyPDFKitty free.</h2>
              <p className="mt-2 text-brand-100">
                No credit card. Free tier covers everyday use, paid plans from $2.99/month.
              </p>
            </div>
            <Button asChild size="lg" variant="outline" className="bg-white text-brand-700 hover:bg-slate-50">
              <Link href={a.primaryCtaHref}>
                {a.primaryCtaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {a.faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related tools */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Tools that replace {a.competitor}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}

        {/* Tip jar — captures users who liked the comparison but aren't ready to subscribe */}
        <section className="mt-16 grid gap-6 md:grid-cols-2 items-start">
          <TipJar variant="card" source={`alternatives-${a.slug}`} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold">Still considering {a.competitor}?</h3>
            <p className="mt-2 text-sm text-slate-700">
              We're not the right fit for everyone. If you&apos;re leaning toward {a.competitor}, here&apos;s the
              direct link to their official site — no offense taken.
            </p>
            {findPartner(a.slug) ? (
              <div className="mt-3">
                <AffiliateLink partner={a.slug} className="text-sm font-medium text-brand-700 underline">
                  Visit {a.competitor}
                </AffiliateLink>
              </div>
            ) : (
              <p className="mt-3 text-sm">
                <a href={a.competitorUrl} rel="nofollow noreferrer" target="_blank" className="text-brand-700 underline inline-flex items-center gap-1">
                  Visit {a.competitor}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            )}
          </div>
        </section>

        {/* Outbound link with rel attributes + FTC disclosure */}
        <div className="mt-10 space-y-3 text-xs text-slate-500">
          <p>
            {a.competitor} is a trademark of its respective owner. This page is an independent comparison
            and is not affiliated with or endorsed by {a.competitor}.
          </p>
          {findPartner(a.slug) && isAffiliate(findPartner(a.slug)!) && <AffiliateDisclosure />}
        </div>
      </main>
      <Footer />
    </>
  );
}

function Box({ label, highlight, children }: { label: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-brand-50 border border-brand-200" : "bg-slate-50 border border-slate-200"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${highlight ? "text-brand-700" : "text-slate-500"}`}>
        {label}
      </p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}
