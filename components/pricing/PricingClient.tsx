"use client";
import { useState } from "react";
import { Check, Sparkles, Crown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PLANS,
  type Plan,
  type BillingInterval,
  priceLabel,
  annualSavings,
} from "@/lib/plans";

export function PricingClient() {
  const [interval, setInterval] = useState<BillingInterval>("monthly");

  return (
    <section className="container py-12 md:py-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
          <Sparkles className="h-3 w-3" /> Starts at $2.99/mo
        </span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
          Affordable PDF tools with fair AI limits
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Use basic PDF tools for free. Upgrade for AI summaries, PDF chat, larger files,
          saved history, OCR, and team workflows.
        </p>
      </div>

      {/* Toggle */}
      <div className="mt-8 flex items-center justify-center">
        <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setInterval("monthly")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-xl transition-colors",
              interval === "monthly" ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("annual")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-xl transition-colors inline-flex items-center gap-2",
              interval === "annual" ? "bg-brand-600 text-white" : "text-slate-700 hover:bg-slate-100",
            )}
          >
            Annual
            <span className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold",
              interval === "annual" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800",
            )}>
              Save up to 47%
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} interval={interval} />
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Prices in USD. Cancel anytime. <span className="text-slate-700 font-medium">No credit card required for Free.</span>
      </p>
    </section>
  );
}

function PricingCard({ plan, interval }: { plan: Plan; interval: BillingInterval }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [busy, setBusy] = useState(false);
  const savings = annualSavings(plan);
  const isFree = plan.id === "free";
  const isHighlight = !!plan.highlight;
  const isAnnual = interval === "annual";
  const showBestValue = isHighlight && isAnnual; // Plus annual badge

  async function checkout() {
    if (isFree) {
      router.push(session?.user ? "/dashboard" : "/signup");
      return;
    }
    if (status === "loading") return;
    if (!session?.user) {
      router.push(`/signup?plan=${plan.id}&interval=${interval}`);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id, interval }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout unavailable");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-white p-6",
        isHighlight ? "border-brand-500 shadow-soft md:scale-[1.02]" : "border-slate-200",
      )}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
          <Sparkles className="h-3 w-3" /> {plan.badge}
        </span>
      )}
      {showBestValue && (
        <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
          <Crown className="h-3 w-3" /> Best value
        </span>
      )}

      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-1 text-sm text-slate-500 min-h-[40px]">{plan.subtitle}</p>

      <div className="mt-4">
        {isFree ? (
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">$0</span>
            <span className="text-slate-500 text-sm">forever</span>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">{priceLabel(plan, interval)}</span>
              <span className="text-slate-500 text-sm">/{isAnnual ? "year" : "month"}</span>
            </div>
            {isAnnual && savings.dollars > 0 && (
              <p className="mt-1 text-xs text-emerald-700 font-medium">
                Save ${savings.dollars} ({savings.percent}% off)
              </p>
            )}
            {!isAnnual && plan.price.annual > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                or ${plan.price.annual}/year
              </p>
            )}
          </div>
        )}
      </div>

      <ul className="mt-5 space-y-2 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 mt-0.5 text-brand-600 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={checkout}
        disabled={busy}
        className="mt-6 w-full"
        variant={isHighlight ? "default" : isFree ? "outline" : "outline"}
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {plan.cta}
      </Button>
      {isFree && (
        <p className="mt-2 text-center text-[11px] text-slate-500">No credit card required</p>
      )}
    </div>
  );
}
