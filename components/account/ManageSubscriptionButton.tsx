"use client";
import { useState } from "react";
import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ManageSubscriptionButton() {
  const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Could not open Stripe portal");
    } finally { setBusy(false); }
  }
  return (
    <Button variant="outline" onClick={go} disabled={busy}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
      Manage subscription
    </Button>
  );
}
