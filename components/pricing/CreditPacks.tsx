"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Coins, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKS } from "@/lib/plans";

export function CreditPacks() {
  const router = useRouter();
  const { data: session } = useSession();
  const [busy, setBusy] = useState<string | null>(null);

  async function buy(packId: string) {
    if (!session?.user) {
      router.push(`/signup?credits=${packId}`);
      return;
    }
    setBusy(packId);
    try {
      const res = await fetch("/api/stripe/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: packId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout unavailable");
    } finally { setBusy(null); }
  }

  return (
    <section id="credit-packs" className="container py-16 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          <Coins className="h-3 w-3" /> Top-up packs
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Need more chat questions?</h2>
        <p className="mt-2 text-slate-600">
          Hit your monthly chat limit? Buy a one-time credit pack — no plan change needed.
          Credits stack on top of your plan&apos;s monthly chat allowance and never expire.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
        {CREDIT_PACKS.map((pack) => (
          <div
            key={pack.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              {pack.id === "small" ? "Starter" : pack.id === "medium" ? "Standard" : "Power"}
            </p>
            <p className="mt-2 text-3xl font-bold">{pack.priceLabel}</p>
            <p className="mt-1 text-slate-700">
              <span className="font-semibold">{pack.questions.toLocaleString()}</span> chat questions
            </p>
            <p className="mt-1 text-xs text-slate-500">
              About ${(pack.perQuestionCents / 100).toFixed(3).replace(/0+$/, "0")} per question
            </p>
            <Button
              onClick={() => buy(pack.id)}
              disabled={busy === pack.id}
              variant={pack.id === "medium" ? "default" : "outline"}
              className="mt-6 w-full"
            >
              {busy === pack.id && <Loader2 className="h-4 w-4 animate-spin" />}
              Buy pack
            </Button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-slate-500 max-w-2xl mx-auto">
        Credits are one-time purchases. They&apos;re used after your monthly plan allowance runs
        out and persist across plan changes. Summaries always count against your monthly
        plan allowance — credits cover chat questions only.
      </p>
    </section>
  );
}
