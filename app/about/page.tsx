import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: `About ${SITE.name}`,
  description: `${SITE.name} is a fast, simple, AI-powered PDF toolkit for everyday document work.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "About", path: "/about" }])} />
      <Header />
      <main className="container py-16 max-w-3xl">
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
        <h1 className="mt-6 text-4xl font-bold">About {SITE.name}</h1>
        <p className="mt-4 text-slate-700">
          {SITE.name} is an all-in-one PDF toolkit for everyday document work — editing, converting,
          signing, compressing, and summarizing PDFs with AI. We&apos;re building a faster, cleaner
          alternative to clunky desktop software.
        </p>
        <h2 className="mt-10 text-2xl font-semibold">Our principles</h2>
        <ul className="mt-3 space-y-2 text-slate-700">
          <li>• <span className="font-medium">Private by default.</span> Files are isolated to your account.</li>
          <li>• <span className="font-medium">Fast.</span> Tools run in your browser whenever possible.</li>
          <li>• <span className="font-medium">Honest.</span> We don&apos;t claim things we haven&apos;t built.</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
