import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TipJar } from "@/components/TipJar";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: `Tip the kitty 🐱 — Support ${SITE.name}`,
  description: "Saved you time? Buy us a coffee. One-time tips via Stripe — keeps the free tools genuinely free.",
  path: "/tip",
});

export default function TipPage() {
  return (
    <>
      <Header />
      <main className="container py-12 md:py-16 max-w-xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Tip the kitty 🐱</h1>
        <p className="mt-3 text-slate-700">
          {SITE.name} runs on a mix of paid subscriptions and tips. If a free tool saved you time,
          a tip helps us keep ad-free, watermark-free PDF tools free for everyone else.
        </p>

        <div className="mt-8">
          <TipJar variant="card" source="tip-page" />
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Where the money goes</p>
          <ul className="mt-2 space-y-1 list-disc list-inside text-slate-600">
            <li>Servers (Vercel, Neon, Vercel Blob) — most of it</li>
            <li>OpenAI API costs for free-tier AI summaries and chat</li>
            <li>Email delivery (Resend)</li>
            <li>Coffee. Mostly coffee.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
