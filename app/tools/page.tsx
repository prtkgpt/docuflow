import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolGrid } from "@/components/ToolGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, itemListLd } from "@/lib/seo";
import { TOOLS } from "@/lib/tools";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMetadata({
  title: "All PDF Tools — Compress, Convert, Edit, Sign & Summarize",
  description:
    "Browse every MyPDFKitty tool: compress, merge, split, edit, sign, convert and summarize PDFs online. Free to start, no install.",
  path: "/tools",
});

export default function ToolsPage() {
  const ld = [
    breadcrumbLd([{ name: "Tools", path: "/tools" }]),
    itemListLd(TOOLS.slice(0, 25).map((t) => ({ name: t.name, url: absoluteUrl(t.href) }))),
  ];
  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-10 md:py-14">
        <Breadcrumbs items={[{ name: "Tools", path: "/tools" }]} />
        <div className="mt-6 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight">All PDF tools</h1>
          <p className="mt-3 text-slate-600">
            Pick a tool to compress, edit, convert, sign or summarize your PDF. New tools are added regularly.
          </p>
        </div>
        <div className="mt-10"><ToolGrid /></div>

        <Link
          href="/use-cases"
          className="mt-12 block rounded-2xl border border-slate-200 bg-gradient-to-r from-brand-50 to-white p-6 hover:border-brand-300 transition"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Use-case guides</p>
          <p className="mt-1 text-xl font-bold inline-flex items-center gap-2">
            Looking for a specific scenario?
            <ArrowRight className="h-5 w-5" />
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Compress for email, merge for resume, sign an NDA, send a contract — guides tuned to the actual task.
          </p>
        </Link>
      </main>
      <Footer />
    </>
  );
}
