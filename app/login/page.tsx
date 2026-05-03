"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, CheckCircle2, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthOptions } from "@/components/auth/AuthOptions";
import { SITE } from "@/lib/site";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const checkEmail = params.get("check") === "email";

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(checkEmail);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      // Try the email magic link first (production). If the email provider
      // isn't configured we fall back to credentials in dev.
      const res = await signIn("email", { email, redirect: false, callbackUrl });
      if (res?.error && res.error !== "EmailSignin") {
        // EmailProvider not configured — try credentials fallback.
        const cred = await signIn("credentials", { email, redirect: false, callbackUrl });
        if (cred?.ok) { router.push(callbackUrl); return; }
        throw new Error(cred?.error || res.error);
      }
      setSent(true);
    } catch (e: any) {
      setError(e.message || "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Check your email
          </CardTitle>
          <CardDescription>
            We just sent a sign-in link to <span className="font-medium text-slate-900">{email || "your inbox"}</span>.
            Click the link to finish signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-slate-500">
            The link expires in 24 hours. If it doesn&apos;t arrive in a minute, check your spam folder.
          </p>
          <Button variant="outline" onClick={() => setSent(false)}>Use a different email</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to {SITE.name} with a magic link sent to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthOptions callbackUrl={callbackUrl} />
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            {busy ? "Sending…" : "Email me a sign-in link"}
          </Button>
          <p className="text-xs text-slate-500 text-center">
            New here?{" "}
            <Link href={`/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`} className="text-brand-700 underline">
              Create a free account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="container py-16 grid place-items-center">
        <Suspense fallback={<div className="h-10 w-40 animate-pulse rounded-xl bg-slate-100" />}>
          <LoginInner />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
