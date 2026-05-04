"use client";
import { useState } from "react";
import { Heart, Loader2, Cat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRESETS = [3, 5, 10, 20];

type Props = {
  variant?: "card" | "inline";
  source?: string; // analytics tag — "footer", "post-tool", etc.
};

export function TipJar({ variant = "card", source = "unknown" }: Props) {
  const [selected, setSelected] = useState<number>(5);
  const [custom, setCustom] = useState<string>("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountDollars = custom.trim() ? Number(custom.trim()) : selected;
  const valid = amountDollars >= 1 && amountDollars <= 500 && !Number.isNaN(amountDollars);

  async function tip() {
    if (!valid) return;
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents: Math.round(amountDollars * 100),
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Could not start checkout");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setBusy(false);
    }
  }

  const wrapperClass =
    variant === "card"
      ? "rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
      : "rounded-xl border border-amber-200 bg-amber-50 p-4";

  return (
    <div className={wrapperClass} data-source={source}>
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-100 text-amber-700">
          <Cat className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-semibold leading-tight">Tip the kitty 🐱</h3>
          <p className="text-xs text-slate-600">Saved you time? Buy us a coffee. Free tools stay free.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => { setSelected(p); setCustom(""); }}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
              !custom && selected === p
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            ${p}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <label className="text-xs text-slate-500">Custom amount</label>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-slate-500">$</span>
          <Input
            type="number"
            inputMode="decimal"
            min={1}
            max={500}
            step={1}
            placeholder="e.g. 7"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3">
        <label className="text-xs text-slate-500">Note (optional, public)</label>
        <Input
          type="text"
          maxLength={200}
          placeholder="Saved me 30 mins — thank you!"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <Button
        onClick={tip}
        disabled={!valid || busy}
        className="mt-4 w-full"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
        {busy ? "Opening checkout…" : `Tip $${valid ? amountDollars : "?"}`}
      </Button>
      <p className="mt-2 text-[11px] text-slate-500 text-center">
        One-time payment via Stripe. Cards only. Min $1, max $500.
      </p>
    </div>
  );
}
