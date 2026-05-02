import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";
import { PLANS } from "@/lib/plans";

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="container py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Simple pricing for everyone</h1>
          <p className="mt-3 text-slate-600">
            Start free. Upgrade for AI summaries, larger files, and team workspaces.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <PricingCard key={p.id} plan={p} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
