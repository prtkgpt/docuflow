"use client";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { initial: { name: string; email: string } };

export function AccountForm({ initial }: Props) {
  const [name, setName] = useState(initial.name);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setSaved(false); setError(null);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setSaved(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="name">Display name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Pat Doe" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={initial.email} disabled />
        <p className="mt-1 text-xs text-slate-500">Contact support to change your account email.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">Saved.</p>}
      <Button type="submit" disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {busy ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
