import Link from "next/link";
import { Sparkles } from "lucide-react";

const COMPETITORS: { name: string; price: string; note?: string; ours?: boolean }[] = [
  { name: "MyPDFKitty Plus", price: "$2.99/mo", note: "Most popular", ours: true },
  { name: "iLovePDF Premium", price: "~$5/mo", note: "billed annually" },
  { name: "Smallpdf Pro", price: "~$10/mo", note: "billed annually" },
  { name: "Adobe Acrobat Standard", price: "$14.99/mo" },
  { name: "DocuSeal Pro", price: "$20/user/mo" },
];

export function ComparisonSection() {
  return (
    <section className="bg-slate-50/70 border-t border-slate-200 py-16">
      <div className="container max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">Ridiculously affordable PDF tools</h2>
          <p className="mt-3 text-slate-700">
            Most paid PDF tools charge $5–$25/month for premium access. MyPDFKitty starts at
            <strong className="font-semibold"> $2.99/month</strong> so students, freelancers,
            and small businesses can edit, convert, compress, sign, and summarize PDFs without
            enterprise pricing.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {COMPETITORS.map((c) => (
            <div
              key={c.name}
              className={
                c.ours
                  ? "rounded-2xl border-2 border-brand-500 bg-white p-5 shadow-soft"
                  : "rounded-2xl border border-slate-200 bg-white p-5"
              }
            >
              {c.ours && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  <Sparkles className="h-3 w-3" /> {c.note ?? "Ours"}
                </span>
              )}
              <p className={c.ours ? "mt-2 font-semibold text-slate-900" : "font-medium text-slate-700"}>
                {c.name}
              </p>
              <p className={c.ours ? "mt-1 text-2xl font-bold text-brand-700" : "mt-1 text-lg font-semibold text-slate-700"}>
                {c.price}
              </p>
              {!c.ours && c.note && <p className="text-xs text-slate-500">{c.note}</p>}
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-500 max-w-3xl mx-auto text-center">
          Competitor prices are shown for general comparison and may change. Check each
          provider&apos;s website for current pricing. We&apos;re one of the most affordable paid
          PDF toolkits — some PDF tools are free, but for paid PDF tools without enterprise
          pricing, MyPDFKitty is built to undercut.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/compare/best-free-pdf-tools"
            className="text-sm text-brand-700 hover:underline font-medium"
          >
            Compare with free PDF tools →
          </Link>
          <Link
            href="/compare/best-ai-pdf-summarizer"
            className="text-sm text-brand-700 hover:underline font-medium"
          >
            Compare AI summarizers →
          </Link>
        </div>
      </div>
    </section>
  );
}
