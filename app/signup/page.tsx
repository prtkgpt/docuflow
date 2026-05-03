"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthOptions } from "@/components/auth/AuthOptions";
import { SITE } from "@/lib/site";

function SignupInner() {
  const router = useRouter();
  const params = useSearchParams();
  // If the user clicked "Sign up" from /pricing, send them straight to checkout
  // after the account is created.
  const planAfter = params.get("plan");
  const callbackUrl = params.get("callbackUrl") || "/dashboard?welcome=1";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res = await signIn("credentials", { email, name, redirect: false });
      if (res?.error) throw new Error(res.error);
      if (!res?.ok) throw new Error("Could not create your account.");

      if (planAfter === "plus" || planAfter === "pro" || planAfter === "business") {
        // Continue to Stripe checkout for the chosen plan.
        const interval = (params.get("interval") === "annual" ? "annual" : "monthly");
        const r = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planAfter, interval }),
        });
        const data = await r.json();
        if (data.url) { window.location.href = data.url; return; }
      }
      router.push(callbackUrl);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Create your free account</CardTitle>
          <CardDescription>
            No password required. We&apos;ll save your files in a private workspace.
            {planAfter && planAfter !== "free" && (
              <span className="block mt-2 text-brand-700">
                After signup, we&apos;ll send you to Stripe to start your <span className="font-semibold capitalize">{planAfter}</span> plan.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthOptions callbackUrl={callbackUrl} label="Sign up with Google" />
          <form className="space-y-4" onSubmit={submit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="name">Name (optional)</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button className="w-full" disabled={busy}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {busy ? "Working…" : planAfter && planAfter !== "free" ? "Create account & continue to checkout" : "Create free account"}
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Already have an account?{" "}
              <Link href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="text-brand-700 underline">
                Sign in
              </Link>
            </p>
            <p className="text-[11px] text-slate-400 text-center">
              By continuing you agree to our{" "}
              <Link className="underline" href="/terms">Terms</Link> and{" "}
              <Link className="underline" href="/privacy">Privacy Policy</Link>.
            </p>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold inline-flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" /> What you get
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Free is generous — upgrade anytime if you need more.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {[
            "3 files / month on Free, up to 10 MB",
            "Compress, merge, split, edit, sign — all included",
            "Private workspace, isolated to your account",
            "AI summaries and Chat with PDF on Pro ($9/mo)",
            "100 MB uploads on Pro, 500 MB on Business",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-brand-600" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <Button asChild variant="outline"><Link href="/pricing">See full pricing</Link></Button>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="container py-12 md:py-16 max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight">Get started with {SITE.name}</h1>
        <p className="mt-2 text-slate-600">Sign up free in under 30 seconds.</p>
        <div className="mt-8">
          <Suspense fallback={<div className="h-10 w-40 animate-pulse rounded-xl bg-slate-100" />}>
            <SignupInner />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
