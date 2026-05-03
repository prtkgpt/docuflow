import Link from "next/link";

const FAQ = [
  {
    q: "Is MyPDFKitty free?",
    a: "Yes. The Free plan includes 5 files per day up to 25 MB each, plus the most-used PDF tools (compress, merge, split, rotate, delete pages, sign), 1 AI summary per month, and 3 PDF chat questions per month. No credit card required.",
  },
  {
    q: "Why is MyPDFKitty cheaper than other PDF tools?",
    a: "We're built lean and we meter AI carefully. The editor and most converters run in your browser, AI calls use retrieval (we send only the relevant chunks of a PDF, not the whole thing) and we cache summaries so the same PDF isn't billed twice. That lets us charge $2.99/mo where similar paid tools charge $5–$25/mo.",
  },
  {
    q: "What is included in Kitty Plus?",
    a: "Kitty Plus ($2.99/mo or $24/year) includes 200 files per month up to 100 MB each, 25 AI summaries and 100 PDF chat questions per month with up to 75,000 tokens per document, no watermarks, saved file history, faster processing, and email support.",
  },
  {
    q: "Do free users get AI summaries?",
    a: "Yes — Free users get 1 AI summary per month and 3 PDF chat questions per month on shorter PDFs. AI usage is metered to keep the product affordable; for more, upgrade to Kitty Plus or buy a credit pack.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your billing page in one click — no calls, no email forms. You keep access until the end of your current billing period.",
  },
  {
    q: "Is Business priced per user?",
    a: "Business is $12.99/month flat (or $99/year) and includes 3 team seats with shared AI quotas. Additional seats are $3/month per seat — significantly cheaper than competitors that charge $20+ per user.",
  },
  {
    q: "Do you add watermarks?",
    a: "We add a small watermark only on AI summaries for the Free plan. Compress, merge, split, sign, edit, and convert outputs are watermark-free even on Free. Paid plans remove the AI watermark entirely.",
  },
  {
    q: "What happens if I hit my monthly file limit?",
    a: "We'll show a clear notice and suggest upgrading. You can upgrade mid-month and the new limit applies immediately — we prorate the bill. For chat questions specifically, you can also buy a one-time AI credit pack from $5.",
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
