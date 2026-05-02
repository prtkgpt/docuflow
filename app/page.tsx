import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Zap,
  EyeOff,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, softwareApplicationLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { findTool } from "@/lib/tools";
import { getAllPosts } from "@/lib/blog";

export const metadata = buildMetadata({
  title: "MyPDFKitty – Edit, Convert, Compress & Summarize PDFs Online",
  description:
    "Use MyPDFKitty to edit, convert, compress, merge, split, sign, and summarize PDFs online. Fast, simple PDF tools with no software install required.",
  path: "/",
});

const FEATURED_SLUGS = [
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "edit-pdf",
  "sign-pdf",
  "pdf-to-word",
  "jpg-to-pdf",
  "ai-summarizer",
  "chat-pdf",
];

const AI_SLUGS = ["ai-summarizer", "chat-pdf", "key-points", "ocr-pdf"];

export default function HomePage() {
  const featured = FEATURED_SLUGS.map(findTool).filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];
  const aiTools = AI_SLUGS.map(findTool).filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];
  const blogPreview = getAllPosts().slice(0, 3);

  return (
    <>
      <JsonLd data={softwareApplicationLd()} />
      <Header />

      {/* Hero */}
      <section id="upload" className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white">
        <div className="container py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800">
              <Sparkles className="h-3.5 w-3.5" /> All-in-one PDF toolkit
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Edit, convert, sign, and summarize PDFs online
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              {SITE.name} helps you work with PDFs faster — compress files, merge pages, convert documents,
              sign forms, and summarize long PDFs with AI.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="#upload">Upload PDF</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/tools">Explore PDF tools</Link></Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <Trust label="Secure HTTPS uploads" icon={ShieldCheck} />
              <Trust label="Private workspace" icon={Lock} />
              <Trust label="Fast processing" icon={Zap} />
              <Trust label="No install" icon={EyeOff} />
            </div>
          </div>
          <div>
            <UploadDropzone redirectTo="/editor" buttonLabel="Choose PDF" />
          </div>
        </div>
      </section>

      {/* Popular tools */}
      <section className="container py-16 md:py-20">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Popular PDF tools</h2>
            <p className="mt-1 text-slate-600">The tools people open every day.</p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-brand-700 hover:underline inline-flex items-center gap-1">
            All tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((t) => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </section>

      {/* AI section */}
      <section className="bg-slate-50/70 py-16 md:py-20">
        <div className="container">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              <Sparkles className="h-3.5 w-3.5" /> AI PDF tools
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Summarize, chat with, and search your PDFs</h2>
            <p className="mt-2 text-slate-600">
              Use AI to skim long PDFs, ask questions in plain language, pull out the key points,
              and turn scans into searchable text — all from your browser.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {aiTools.map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16 md:py-20">
        <h2 className="text-3xl font-bold text-center">How {SITE.name} works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: 1, t: "Upload your PDF", d: "Drop a file from your computer or browse to pick one. Files stay in your private workspace." },
            { n: 2, t: "Pick a tool", d: "Compress, merge, split, edit, sign, convert, or summarize with AI." },
            { n: 3, t: "Download the result", d: "Get the new PDF in seconds and share it anywhere." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-semibold">{s.n}</div>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="container pb-16">
        <h2 className="text-2xl md:text-3xl font-bold">Use cases</h2>
        <p className="mt-1 text-slate-600">Common things people do with {SITE.name}.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Shrink a PDF for email", d: "Compress big PDFs to fit Gmail, Outlook, and ATS upload limits." , href: "/tools/compress-pdf" },
            { t: "Combine receipts or scans", d: "Merge multiple PDFs and images into one clean document." , href: "/tools/merge-pdf" },
            { t: "Sign a contract online", d: "Type, draw, or upload a signature and place it on any page." , href: "/tools/sign-pdf" },
            { t: "Turn a scan into text", d: "Run OCR on scanned PDFs so you can search and copy the text." , href: "/tools/ocr-pdf" },
            { t: "Summarize a long PDF", d: "Get a short summary, highlights, and action items from any PDF." , href: "/tools/ai-pdf-summarizer" },
            { t: "Ask questions about a PDF", d: "Chat with your document and get answers cited to a page." , href: "/tools/chat-with-pdf" },
          ].map((u) => (
            <Link key={u.t} href={u.href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft hover:border-brand-300 hover:-translate-y-0.5 transition">
              <h3 className="font-semibold">{u.t}</h3>
              <p className="mt-1 text-sm text-slate-600">{u.d}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-700 opacity-0 group-hover:opacity-100 transition">
                Open tool <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="bg-slate-50/70 py-16">
        <div className="container grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold">Built with privacy in mind</h2>
            <p className="mt-3 text-slate-600">
              Files are uploaded over HTTPS and isolated to your account. You can delete a file from
              your dashboard at any time. We don&apos;t share your documents with third parties.
            </p>
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline"><Link href="/security">Read our security overview</Link></Button>
              <Button asChild variant="ghost"><Link href="/privacy">Privacy policy</Link></Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {[
              { i: ShieldCheck, t: "HTTPS uploads" },
              { i: Lock, t: "Account-isolated files" },
              { i: EyeOff, t: "No third-party sharing" },
              { i: Zap, t: "Delete on demand" },
            ].map(({ i: Icon, t }) => (
              <li key={t} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                <Icon className="h-5 w-5 text-brand-700" />
                <p className="mt-2 text-sm font-medium">{t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Blog preview */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Guides &amp; resources</h2>
            <p className="mt-1 text-slate-600">PDF how-tos and AI tips, written for people who actually need to get something done.</p>
          </div>
          <Link href="/blog" className="text-sm font-medium text-brand-700 hover:underline inline-flex items-center gap-1">
            All guides <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {blogPreview.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft hover:border-brand-300 transition">
              <p className="text-xs uppercase tracking-wide text-brand-700">{p.category}</p>
              <h3 className="mt-1 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{p.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-700 group-hover:underline">Read guide <ArrowRight className="h-4 w-4" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-16">
        <h2 className="text-3xl font-bold text-center">Frequently asked questions</h2>
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {FAQ.map((q) => (
            <details key={q.q} className="group p-5">
              <summary className="cursor-pointer list-none flex justify-between items-center">
                <span className="font-medium">{q.q}</span>
                <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-slate-600 text-sm">{q.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container pb-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Start with any PDF</h2>
        <p className="mt-2 text-slate-600">Drop a file and {SITE.name} will take it from there.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg"><Link href="#upload">Upload your file</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/tools">Browse tools</Link></Button>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Trust({ label, icon: Icon }: { label: string; icon: any }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-4 w-4 text-emerald-600" /> {label}
    </span>
  );
}

const FAQ = [
  { q: `Is ${SITE.name} free?`, a: `Yes. The Free plan supports 3 files per month up to 10 MB. Upgrade to Pro for AI tools and larger files.` },
  { q: "Are my files secure?", a: "Uploads are sent over HTTPS and isolated to your workspace. We don't share your files with third parties." },
  { q: "What file types are supported?", a: "PDF, DOCX, JPG, PNG, and more depending on the tool you pick." },
  { q: "Can I edit text inside a PDF?", a: "You can add text, signatures, highlights, and more in the editor today. Rewriting existing PDF text is on the roadmap." },
  { q: "Can I use AI to summarize PDFs?", a: "Yes. The AI Summarizer returns a short summary, highlights, takeaways and action items." },
  { q: "Do I need to install anything?", a: `No. ${SITE.name} runs entirely in your browser — no plugins or downloads.` },
];
