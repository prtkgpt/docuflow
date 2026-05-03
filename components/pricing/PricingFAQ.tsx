import Link from "next/link";

const FAQ = [
  {
    q: "Is MyPDFKitty free?",
    a: "Yes. The Free plan includes 5 files per day up to 25 MB each, plus the most-used PDF tools (compress, merge, split, rotate, delete pages, sign) and 3 AI summaries per month. No credit card required.",
  },
  {
    q: "Why is MyPDFKitty cheaper than other PDF tools?",
    a: "We're built lean: the editor and most converters run in your browser, our AI runs efficiently against text-only extraction, and we don't fund a giant sales team. That lets us charge $2.99/mo where similar paid tools charge $5–$25/mo.",
  },
  {
    q: "What is included in Kitty Plus?",
    a: "Kitty Plus ($2.99/mo or $19/year) includes 200 files per month up to 100 MB each, no watermarks, AI PDF summaries, Chat with PDF, saved file history, faster processing, and email support.",
  },
  {
    q: "Do free users get AI summaries?",
    a: "Yes — Free users get 3 AI summaries per month on PDFs up to ~6 pages of text. Chat with PDF is included starting at Kitty Plus.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your billing page in one click — no calls, no email forms. You keep access until the end of your current billing period.",
  },
  {
    q: "Is Business priced per user?",
    a: "Business is $9.99/month flat (or $79/year) and includes 3 team seats. Additional seats are $3/month per seat — significantly cheaper than competitors that charge $20+ per user.",
  },
  {
    q: "Do you add watermarks?",
    a: "We add a small watermark only on AI summaries for the Free plan. Compress, merge, split, sign, edit, and convert outputs are watermark-free even on Free. Paid plans remove the AI watermark too.",
  },
  {
    q: "What happens if I hit my monthly file limit?",
    a: "We'll show a clear notice and suggest upgrading. You can upgrade mid-month and the new limit applies immediately — we prorate the bill.",
  },
];

export function PricingFAQ() {
  return (
    <section className="container py-16 max-w-3xl">
      <h2 className="text-3xl font-bold text-center">Pricing FAQ</h2>
      <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {FAQ.map((q) => (
          <details key={q.q} className="group p-5">
            <summary className="cursor-pointer list-none flex justify-between items-center">
              <span className="font-medium">{q.q}</span>
              <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-sm text-slate-600">{q.a}</p>
          </details>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/tools/compress-pdf" className="text-brand-700 hover:underline">Compress PDF</Link>
        <span className="text-slate-300">·</span>
        <Link href="/tools/merge-pdf" className="text-brand-700 hover:underline">Merge PDF</Link>
        <span className="text-slate-300">·</span>
        <Link href="/tools/ai-pdf-summarizer" className="text-brand-700 hover:underline">AI Summarizer</Link>
        <span className="text-slate-300">·</span>
        <Link href="/tools/chat-with-pdf" className="text-brand-700 hover:underline">Chat with PDF</Link>
      </div>
    </section>
  );
}

export function PricingFaqLd() {
  // Returned to the page as JSON-LD for rich snippets.
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: { "@type": "Answer", text: q.a },
    })),
  };
}
