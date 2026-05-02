import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { findTool } from "@/lib/tools";
import { COMPARISONS, getComparison } from "@/lib/compare";
import {
  buildMetadata,
  breadcrumbLd,
  articleLd,
  faqLd,
  itemListLd,
} from "@/lib/seo";
import { absoluteUrl, SITE } from "@/lib/site";

type Params = { params: { slug: string } };

export async function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getComparison(params.slug);
  if (!c) return buildMetadata({ title: "Comparison not found", description: "", path: `/compare/${params.slug}`, noindex: true });
  return buildMetadata({ title: c.title, description: c.description, path: `/compare/${c.slug}` });
}

export default function ComparisonPage({ params }: Params) {
  const c = getComparison(params.slug);
  if (!c) notFound();
  const breadcrumbs = [
    { name: "Compare", path: "/compare" },
    { name: c.h1, path: `/compare/${c.slug}` },
  ];
  const ld = [
    breadcrumbLd(breadcrumbs),
    articleLd({
      title: c.title,
      description: c.description,
      path: `/compare/${c.slug}`,
      datePublished: "2026-01-08",
    }),
    faqLd(c.faq),
    itemListLd(c.table.map((t) => ({ name: t.name, url: absoluteUrl(`/compare/${c.slug}`) }))),
  ];
  const related = c.relatedToolSlugs
    .map(findTool)
    .filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12 max-w-4xl">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight">{c.h1}</h1>
        <p className="mt-3 text-slate-700 text-lg">{c.intro}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">At-a-glance comparison</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Tool</th>
                  <th className="px-4 py-3 font-medium">Pros</th>
                  <th className="px-4 py-3 font-medium">Cons</th>
                  <th className="px-4 py-3 font-medium">Best for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {c.table.map((row) => (
                  <tr key={row.name}>
                    <td className="px-4 py-3 font-semibold">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700">{row.pros}</td>
                    <td className="px-4 py-3 text-slate-700">{row.cons}</td>
                    <td className="px-4 py-3 text-slate-700">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Pricing and feature data on competing tools changes often. Verify on each provider&apos;s site before purchasing.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Our take</h2>
          <p className="mt-2 text-slate-700">{c.verdict}</p>
          <div className="mt-4">
            <Button asChild size="lg"><Link href={c.ourCta.href}>{c.ourCta.label}</Link></Button>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Related {SITE.name} tools</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {related.map((t) => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-2xl font-bold">FAQ</h2>
          <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {c.faq.map((q) => (
              <details key={q.q} className="group p-5">
                <summary className="cursor-pointer list-none flex justify-between items-center">
                  <span className="font-medium">{q.q}</span>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{q.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
