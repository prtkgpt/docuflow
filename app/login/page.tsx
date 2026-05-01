"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // NextAuth credentials provider — sign in via REST endpoint to avoid client SDK.
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, name, redirect: "false", csrfToken: await getCsrf(), json: "true" }).toString(),
      });
      if (res.ok) window.location.href = "/dashboard";
      else setError("Could not sign in. Please try again.");
    } catch (e: any) {
      setError(e.message || "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Header />
      <main className="container py-16 grid place-items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in to DocuFlow</CardTitle>
            <CardDescription>Use your email to access your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="name">Name (optional)</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Continue"}</Button>
              <p className="text-xs text-slate-500 text-center">
                We'll create an account if one doesn't exist. No password required for the MVP.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}

async function getCsrf(): Promise<string> {
  try {
    const r = await fetch("/api/auth/csrf");
    const d = await r.json();
    return d.csrfToken || "";
  } catch {
    return "";
  }
}
