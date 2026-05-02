"use client";
import { useState } from "react";
import { Mail, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmail } from "@/lib/session-client";

type Props = {
  onClose: () => void;
  onComplete: (email: string) => void;
};

// Modal that prompts an email address before letting the user download a
// processed PDF. Creates (or reuses) a free-tier account via NextAuth's
// credentials provider, then resolves so the caller can re-trigger Save.
export function EmailGateModal({ onClose, onComplete }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setBusy(true);
    try {
      const ok = await signInWithEmail(email.trim().toLowerCase(), name.trim() || undefined);
      if (!ok) throw new Error("Could not create your account. Please try again.");
      onComplete(email.trim().toLowerCase());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="font-semibold">One quick step</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold">Enter your email to download</h4>
            <p className="mt-1 text-sm text-slate-600">
              We&apos;ll save your file in your MyPDFKitty workspace so you can come back to it any time.
              No password needed.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="emailgate-email">Email</label>
            <Input
              id="emailgate-email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="emailgate-name">Name (optional)</label>
            <Input
              id="emailgate-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pat Doe"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {busy ? "Working…" : "Continue & download"}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            By continuing you agree to our{" "}
            <a href="/terms" className="underline">Terms</a> and{" "}
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
