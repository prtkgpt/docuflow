import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles, Lightbulb } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { findTool } from "@/lib/tools";
import { USE_CASES, findUseCase, relatedUseCases } from "@/lib/use-cases";
import {
  buildMetadata,
  breadcrumbLd,
  faqLd,
  howToLd,
  softwareApplicationLd,
} from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

// Catches /tools/<slug> for any slug not already represented by a static
// tool folder. Static folders (compress-pdf, merge-pdf, etc.) take
// precedence — Next.js routes statics before dynamics in the App Router.
export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const u = findUseCase(params.slug);
  if (!u) return {};
  return buildMetadata({
    title: u.metaTitle,
    description: u.metaDescription,
    path: `/tools/${u.slug}`,
  });
}

export default function UseCasePage({ params }: { params: { slug: string } }) {
  const u = findUseCase(params.slug);
  if (!u) notFound();

  const path = `/tools/${u.slug}`;
  const breadcrumbs = [
    { name: "Tools", path: "/tools" },
    { name: u.h1, path },
  ];
  const parentTool = findTool(u.parentToolSlug);
  const siblings = relatedUseCases(u.related);

  const ld = [
    softwareApplicationLd({
      name: `${u.h1} – ${SITE.name}`,
      description: u.metaDescription,
      url: absoluteUrl(path),
    }),
    breadcrumbLd(breadcrumbs),
    howToLd({
      name: u.h1,
      description: u.intro,
      steps: u.steps,
    }),
    faqLd(u.faq),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        {/* Hero */}
        <div className="mt-6 grid gap-8 md:grid-cols-[1.5fr_1fr] items-start">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-brand-700">{u.category}</p>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold tracking-tight">{u.h1}</h1>
            <p className="mt-4 text-lg text-slate-700">{u.intro}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg">
                <Link href={u.parentToolHref}>
                  {u.ctaLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {parentTool && (
                <Button asChild variant="outline" size="lg">
                  <Link href={parentTool.href}>Open {parentTool.name}</Link>
                </Button>
              )}
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Works in your browser — no install</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Files private and isolated to your workspace</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span>Free tier covers most everyday use</span>
              </li>
            </ul>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">How it works</h2>
            <ol className="mt-4 space-y-3">
              {u.steps.map((s, i) => (
                <li key={s.name} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-slate-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button asChild className="mt-5 w-full">
              <Link href={u.parentToolHref}>{u.ctaLabel}</Link>
            </Button>
          </aside>
        </div>

        {/* What to know — the unique-content engine of this page */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What you should know</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {u.whatToKnow.map((k) => (
              <div key={k.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-semibold inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  {k.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700">{k.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        {u.tips.length > 0 && (
          <section className="mt-16 rounded-3xl bg-slate-50 p-6 md:p-8">
            <h2 className="text-2xl font-bold tracking-tight inline-flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              Tips that actually help
            </h2>
            <ul className="mt-4 space-y-2">
              {u.tips.map((t) => (
                <li key={t} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 rounded-3xl bg-brand-600 p-8 md:p-10 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{u.ctaLabel}.</h2>
              <p className="mt-2 text-brand-100">No install, no signup wall, no watermark on paid plans.</p>
            </div>
            <Button asChild size="lg" variant="outline" className="bg-white text-brand-700 hover:bg-slate-50">
              <Link href={u.parentToolHref}>
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {u.faq.map((f) => (
              <details key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related scenarios */}
        {siblings.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Related scenarios</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/tools/${s.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300 hover:shadow-soft transition"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.category}</p>
                  <h3 className="mt-1 font-semibold group-hover:text-brand-700">{s.h1.split("—")[0].trim()}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{s.intro}</p>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                    Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cross-link to parent tool */}
        {parentTool && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Or use the full tool</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <ToolCard tool={parentTool} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
