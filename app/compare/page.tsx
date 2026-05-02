import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, itemListLd } from "@/lib/seo";
import { COMPARISONS } from "@/lib/compare";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "PDF Tool Comparisons & Alternatives | MyPDFKitty",
  description:
    "Honest, up-to-date comparisons of PDF editors, compressors, AI PDF summarizers, and Adobe Acrobat alternatives.",
  path: "/compare",
});

export default function ComparePage() {
  const ld = [
    breadcrumbLd([{ name: "Compare", path: "/compare" }]),
    itemListLd(COMPARISONS.map((c) => ({ name: c.h1, url: absoluteUrl(`/compare/${c.slug}`) }))),
  ];
  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-10 md:py-14">
        <Breadcrumbs items={[{ name: "Compare", path: "/compare" }]} />
        <div className="mt-6 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">PDF tool comparisons</h1>
          <p className="mt-3 text-slate-600">
            Honest, practical roundups to help you pick the right PDF tool. We update these regularly
            and use cautious language about competitor pricing — verify on each provider's site
            before purchasing.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {COMPARISONS.map((c) => (
            <Link
              key={c.slug}
              href={`/compare/${c.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft hover:border-brand-300"
            >
              <h2 className="font-semibold">{c.h1}</h2>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
