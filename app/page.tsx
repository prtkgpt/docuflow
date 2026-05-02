import Link from "next/link";
import { ShieldCheck, Lock, Zap, EyeOff, Sparkles, FileEdit, FileArchive, PenTool, Cloud, RefreshCw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UploadDropzone } from "@/components/UploadDropzone";
import { ToolGrid } from "@/components/ToolGrid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section id="upload" className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white">
        <div className="container py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800">
              <Sparkles className="h-3.5 w-3.5" /> All-in-one PDF toolkit
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Edit, convert, sign, and summarize PDFs in seconds
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              A fast, secure PDF toolkit for everyday documents — no software install required.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="#upload">Upload PDF</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/tools">Explore tools</Link></Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <Trust label="Secure uploads" icon={ShieldCheck} />
              <Trust label="Encrypted storage" icon={Lock} />
              <Trust label="Private by default" icon={EyeOff} />
              <Trust label="Fast processing" icon={Zap} />
            </div>
          </div>
          <div>
            <UploadDropzone redirectTo="/workspace" buttonLabel="Choose PDF" />
          </div>
        </div>
      </section>

      {/* Metric cards */}
      <section className="container -mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "PDF editing", icon: FileEdit },
          { label: "File conversion", icon: RefreshCw },
          { label: "AI summaries", icon: Sparkles },
          { label: "eSignatures", icon: PenTool },
        ].map(({ label, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">{label}</p>
            <p className="text-xs text-slate-500">Built into your workspace.</p>
          </div>
        ))}
      </section>

      {/* Tool directory */}
      <section className="container py-16 md:py-20">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Every PDF tool you need</h2>
            <p className="mt-1 text-slate-600">Pick a tool and run it on your file in seconds.</p>
          </div>
          <Link href="/tools" className="text-sm font-medium text-brand-700 hover:underline">View all tools →</Link>
        </div>
        <div id="convert" className="mt-8" />
        <div id="ai" />
        <div className="mt-2"><ToolGrid /></div>
      </section>

      {/* Features */}
      <section className="bg-slate-50/70 py-16 md:py-20">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center">Built for everyday document work</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Start with any PDF</h2>
        <p className="mt-2 text-slate-600">Drop a file and we'll take it from there.</p>
        <div className="mt-6 flex justify-center">
          <Button asChild size="lg"><Link href="#upload">Upload your file</Link></Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-20">
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

const FEATURES = [
  { title: "Edit PDFs online", body: "Add text, images, signatures, and rearrange pages right in your browser.", icon: FileEdit },
  { title: "Convert files quickly", body: "Move between PDF, Word, JPG, PNG, Excel and PowerPoint formats.", icon: RefreshCw },
  { title: "Compress large PDFs", body: "Shrink heavy files for email and web while keeping quality.", icon: FileArchive },
  { title: "Sign documents", body: "Type, draw or upload a signature and place it on any page.", icon: PenTool },
  { title: "Summarize long PDFs with AI", body: "Get short summaries, key points and action items in seconds.", icon: Sparkles },
  { title: "Secure cloud workspace", body: "Files are uploaded over HTTPS and isolated to your account.", icon: Cloud },
];

const FAQ = [
  { q: "Is DocuFlow free?", a: "Yes. The Free plan supports 3 files per month up to 10 MB. Upgrade to Pro for AI tools and larger files." },
  { q: "Are my files secure?", a: "Uploads are sent over HTTPS and isolated to your workspace. We do not share your files." },
  { q: "What file types are supported?", a: "PDF, DOCX, JPG, PNG, and more depending on the tool you pick." },
  { q: "Can I edit text inside a PDF?", a: "Yes. Use the Edit PDF tool to update text and rearrange pages." },
  { q: "Can I use AI to summarize PDFs?", a: "Yes. The AI Summarizer returns a short summary, highlights, takeaways and action items." },
  { q: "Do I need to install anything?", a: "No. DocuFlow runs entirely in your browser — no plugins or downloads." },
];
