"use client";
import Link from "next/link";
import { Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  reason?: string;
};

export function UpgradeModal({ open, onClose, reason }: Props) {
  if (!open) return null;
  async function checkout() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "pro" }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Checkout unavailable");
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" /> Upgrade to Pro
          </h3>
          <button onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          {reason && <p className="text-sm text-slate-700">{reason}</p>}
          <ul className="space-y-2 text-sm">
            {[
              "100 files / month",
              "Up to 100 MB per file",
              "AI summaries and chat with PDF",
              "Priority processing",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-brand-600" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="text-2xl font-bold pt-2">$9 <span className="text-sm font-normal text-slate-500">/ month</span></p>
        </div>
        <div className="flex gap-2 border-t border-slate-200 px-5 py-3">
          <Button asChild variant="outline" className="flex-1"><Link href="/pricing">Compare plans</Link></Button>
          <Button onClick={checkout} className="flex-1">Upgrade to Pro</Button>
        </div>
      </div>
    </div>
  );
}
