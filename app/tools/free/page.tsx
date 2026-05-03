import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { buildMetadata, breadcrumbLd, itemListLd } from "@/lib/seo";
import { findTool } from "@/lib/tools";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Free PDF Tools — Edit, Convert, Compress & Sign Online | MyPDFKitty",
  description:
    "Free online PDF tools: compress, merge, split, edit, sign, convert, OCR, and AI summarize. No software install. No credit card.",
  path: "/tools/free",
});

const FREE_PDF = ["sign-pdf", "pdf-to-word", "compress-pdf", "merge-pdf", "split-pdf", "edit-pdf", "jpg-to-pdf", "pdf-to-jpg", "word-to-pdf"];
const FREE_AI = ["ai-summarizer", "chat-pdf", "ocr-pdf"];
const FREE_IMG = ["jpg-to-png", "png-to-jpg", "jpg-to-pdf", "png-to-pdf", "pdf-to-jpg"];

export default function FreeToolsPage() {
  const breadcrumbs = [
    { name: "Tools", path: "/tools" },
    { name: "Free", path: "/tools/free" },
  ];
  const tools = [...FREE_PDF, ...FREE_AI, ...FREE_IMG]
    .map(findTool)
    .filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];

  const ld = [
    breadcrumbLd(breadcrumbs),
    itemListLd(tools.map((t) => ({ name: t.name, url: absoluteUrl(t.href) }))),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-10 md:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">Free Online PDF Tools</h1>
          <p className="mt-3 text-slate-700 text-lg">
            Compress, merge, split, edit, sign, convert, and summarize PDFs online — free.
            No software install. No credit card. Upload your file and download the result.
          </p>
          <div className="mt-5 flex gap-2">
            <Button asChild><Link href="/#upload">Upload a PDF</Link></Button>
            <Button asChild variant="outline"><Link href="/pricing">Compare plans</Link></Button>
          </div>
        </div>

        <Section title="Free PDF tools" slugs={FREE_PDF} />
        <Section title="Free AI PDF tools" slugs={FREE_AI} />
        <Section title="Free image conversion" slugs={FREE_IMG} />

        <div className="mt-16 rounded-2xl bg-brand-50 p-8 text-center">
          <h2 className="text-2xl font-bold">No paywall on the basics</h2>
          <p className="mt-2 text-slate-700 max-w-2xl mx-auto">
            Free covers everyday work — compress, merge, split, edit, sign, and convert files
            up to 10&nbsp;MB. Upgrade only when you need bigger uploads, AI on long documents,
            saved history, or batch tools.
          </p>
          <div className="mt-4">
            <Button asChild><Link href="/#upload">Get started free</Link></Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, slugs }: { title: string; slugs: string[] }) {
  const tools = slugs
    .map(findTool)
    .filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];
  if (tools.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tools.map((t) => <ToolCard key={t.slug} tool={t} />)}
      </div>
    </section>
  );
}
