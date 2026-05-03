"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/plans";

export function PricingCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [busy, setBusy] = useState(false);

  async function checkout() {
    if (plan.id === "free") {
      router.push(session?.user ? "/dashboard" : "/signup");
      return;
    }
    if (status === "loading") return;
    if (!session?.user) {
      // Need an account before checkout. Carry the chosen plan through signup.
      router.push(`/signup?plan=${plan.id}`);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan.id }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout unavailable");
    } finally { setBusy(false); }
  }

  return (
    <div className={`relative flex h-full flex-col rounded-2xl border ${plan.highlight ? "border-brand-400 shadow-soft" : "border-slate-200"} bg-white p-6`}>
      {plan.highlight && (
        <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-xs font-medium text-white">
          <Sparkles className="h-3 w-3" /> Most popular
        </span>
      )}
      <h3 className="text-lg font-semibold">{plan.name}</h3>
      <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold">{plan.priceLabel}</span>
        {plan.price > 0 && <span className="text-slate-500">/month</span>}
      </div>
      <ul className="mt-5 space-y-2 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 mt-0.5 text-brand-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Button onClick={checkout} disabled={busy} className="mt-6 w-full" variant={plan.highlight ? "default" : "outline"}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {plan.cta}
      </Button>
    </div>
  );
}
