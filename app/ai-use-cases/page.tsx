import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: "AI PDF Tools for Students, Professionals & Businesses | MyPDFKitty",
  description:
    "Explore practical ways to use AI PDF tools to summarize documents, ask questions, extract action items, study research papers, and review business files.",
  path: "/ai-use-cases",
});

const SECTIONS = [
  { h: "Summarize long PDFs", b: "Get a short overview, bullet highlights, and clear takeaways from any text-based PDF — great for triaging reports before a meeting." },
  { h: "Chat with PDFs", b: "Ask questions and get answers grounded in the document, with cited pages so you can verify." },
  { h: "Extract key points", b: "Pull out the most important takeaways from a long doc when you don't have time for a full read." },
  { h: "Turn PDFs into study notes", b: "Summarize chapters or papers into bullet notes you can revise from later." },
  { h: "Review contracts", b: "Use AI to spot odd terms or unfamiliar clauses, then send the highlights to a human reviewer." },
  { h: "Summarize research papers", b: "Pull out methodology, findings, and limitations in plain language." },
  { h: "Organize business documents", b: "Combine summaries with merging and splitting to reorganize a messy folder of PDFs." },
];

export default function AiUseCasesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "AI use cases", path: "/ai-use-cases" }])} />
      <Header />
      <main className="container py-10 md:py-14 max-w-3xl">
        <Breadcrumbs items={[{ name: "AI use cases", path: "/ai-use-cases" }]} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight">
          AI PDF tools for students, professionals, and small businesses
        </h1>
        <p className="mt-3 text-lg text-slate-700">
          {SITE.name}'s AI tools are built for people with too many PDFs and not enough time. Below are
          the most common ways people put them to work.
        </p>

        <div className="mt-8 grid gap-4">
          {SECTIONS.map((s) => (
            <div key={s.h} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <h2 className="font-semibold">{s.h}</h2>
              <p className="mt-1 text-sm text-slate-700">{s.b}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-2xl bg-brand-50 p-6 text-center">
          <h2 className="text-xl font-bold">Try the AI tools today</h2>
          <p className="mt-1 text-slate-700">Free to preview. Pro unlocks summarization and chat.</p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild><Link href="/tools/ai-pdf-summarizer">AI PDF Summarizer</Link></Button>
            <Button asChild variant="outline"><Link href="/tools/chat-with-pdf">Chat with PDF</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
