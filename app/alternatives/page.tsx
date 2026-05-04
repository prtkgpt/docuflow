import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { ALTERNATIVES } from "@/lib/alternatives";
import { breadcrumbLd, buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

const PATH = "/alternatives";

export const metadata = buildMetadata({
  title: `Alternatives to popular PDF tools | ${SITE.name}`,
  description:
    "Looking for a cheaper or simpler alternative to DocuSign, Smallpdf, iLovePDF, Adobe Acrobat, or PDFfiller? See how MyPDFKitty compares — features, pricing, and where each one wins.",
  path: PATH,
});

export default function AlternativesIndex() {
  const breadcrumbs = [{ name: "Alternatives", path: PATH }];
  const ld = [
    breadcrumbLd(breadcrumbs),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: ALTERNATIVES.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/alternatives/${a.slug}`),
        name: `${a.competitor} alternative — ${SITE.name}`,
      })),
    },
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            The affordable alternative to every PDF tool you&apos;re paying too much for
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            DocuSign at $15/user. Adobe Acrobat at $14.99. Smallpdf at $9. iLovePDF Premium at $7.
            Most people don&apos;t need the enterprise feature set — just the core PDF tools that work.
            MyPDFKitty starts at $0 and tops out at $12.99/month for a 3-seat team plan with everything.
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

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {ALTERNATIVES.map((a) => (
            <Link
              key={a.slug}
              href={`/alternatives/${a.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:shadow-soft transition"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {a.category}
              </p>
              <h2 className="mt-1 text-xl font-bold group-hover:text-brand-700">
                {a.competitor} alternative
              </h2>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{a.intro}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700">
                Compare <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-3xl bg-slate-50 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold">Not sure which one fits?</h2>
          <p className="mt-3 text-slate-700 max-w-2xl">
            If you mostly need to send PDFs for signing, start with our <Link href="/alternatives/docusign" className="text-brand-700 underline">DocuSign alternative</Link>.
            If you compress, merge, and convert daily, the <Link href="/alternatives/smallpdf" className="text-brand-700 underline">Smallpdf alternative</Link> covers it.
            Editing all day inside Creative Cloud? See the <Link href="/alternatives/adobe-acrobat" className="text-brand-700 underline">Adobe Acrobat alternative</Link>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
