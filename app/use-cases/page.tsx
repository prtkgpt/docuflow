import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { USE_CASES } from "@/lib/use-cases";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

const PATH = "/use-cases";

export const metadata = buildMetadata({
  title: `PDF use cases — guides for every scenario | ${SITE.name}`,
  description:
    "Practical guides for every PDF scenario — compress for email, merge for resume, sign NDAs, send contracts. Each one tuned to the actual task with real numbers and limits.",
  path: PATH,
});

export default function UseCasesIndex() {
  const breadcrumbs = [{ name: "Use cases", path: PATH }];
  const ld = [
    breadcrumbLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: USE_CASES.map((u, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/tools/${u.slug}`),
        name: u.h1,
      })),
    },
  ];

  // Group by parent tool category for the hub layout.
  const byCategory = new Map<string, typeof USE_CASES>();
  for (const u of USE_CASES) {
    const list = byCategory.get(u.category) ?? [];
    list.push(u);
    byCategory.set(u.category, list);
  }

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            PDF use cases — guides for every scenario
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Each guide is written for a specific task — with real attachment limits, ATS quirks,
            tax form caps, and the small details that actually matter. Skim the category, find your
            scenario, get it done.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild size="lg">
              <Link href="/tools">
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>

        {Array.from(byCategory.entries()).map(([cat, items]) => (
          <section key={cat} className="mt-12">
            <h2 className="text-2xl font-bold">{cat}</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((u) => (
                <Link
                  key={u.slug}
                  href={`/tools/${u.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-brand-300 hover:shadow-soft transition"
                >
                  <h3 className="font-semibold group-hover:text-brand-700">
                    {u.h1.split("—")[0].trim()}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-3">{u.intro}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                    Read guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
