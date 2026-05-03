"use client";
import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
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
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const res = await signIn("credentials", { email, redirect: false, callbackUrl });
      if (res?.error) throw new Error(res.error);
      if (res?.ok) router.push(callbackUrl);
    } catch (e: any) {
      setError(e.message || "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to {SITE.name} with your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthOptions callbackUrl={callbackUrl} />
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Continue"}</Button>
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
