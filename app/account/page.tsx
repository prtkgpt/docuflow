import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { LogOut, CreditCard, Files, Sparkles, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getUserQuota } from "@/lib/quotas";
import { getPlan } from "@/lib/plans";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { AccountForm } from "@/components/account/AccountForm";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: `Account settings | ${SITE.name}`,
  description: `Manage your ${SITE.name} account, plan, and preferences.`,
  path: "/account",
  noindex: true,
});

export default async function AccountPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?callbackUrl=/account");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const quota = await getUserQuota(userId);
  const plan = getPlan(quota.plan);

  return (
    <>
      <Header />
      <main className="container py-10 md:py-14 max-w-3xl">
        <h1 className="text-3xl font-bold">Account settings</h1>
        <p className="mt-1 text-sm text-slate-600">Update your profile, plan, and login email.</p>

        <div className="mt-8 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Display name and contact email.</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountForm
                initial={{
                  name: user?.name ?? "",
                  email: user?.email ?? session?.user?.email ?? "",
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">Plan: <span className="capitalize">{plan.name}</span></CardTitle>
              <CardDescription>{quota.used} / {quota.filesLimit} files {quota.filesPeriod === "day" ? "today" : "this month"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-brand-600" style={{ width: `${Math.min(100, Math.round((quota.used / Math.max(1, quota.filesLimit)) * 100))}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {quota.plan !== "business" && (
                  <Button asChild><Link href="/pricing"><Sparkles className="h-4 w-4" /> Upgrade</Link></Button>
                )}
                <Button asChild variant="outline"><Link href="/dashboard/billing"><CreditCard className="h-4 w-4" /> Billing</Link></Button>
                <Button asChild variant="outline"><Link href="/dashboard/files"><Files className="h-4 w-4" /> My files</Link></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2"><Mail className="h-4 w-4" /> Login email</CardTitle>
              <CardDescription>Used to sign in with the magic-link / passwordless flow.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">{user?.email ?? "—"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign out</CardTitle>
              <CardDescription>Sign out from this browser.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action="/api/auth/signout" method="POST">
                <input type="hidden" name="callbackUrl" value="/" />
                <Button variant="outline" type="submit">Sign out</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
