import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getUserQuota } from "@/lib/quotas";
import { getPlan } from "@/lib/plans";
import { ManageSubscriptionButton } from "@/components/account/ManageSubscriptionButton";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?callbackUrl=/dashboard/billing");

  const quota = await getUserQuota(userId);
  const plan = getPlan(quota.plan);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-slate-600">Manage your MyPDFKitty subscription and usage.</p>
      </div>
      <Card>
        <CardHeader>
          <CardDescription>Current plan</CardDescription>
          <CardTitle className="capitalize">{plan.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-700">
          <div className="grid gap-2 sm:grid-cols-2">
            <Stat label="Files / month" value={`${quota.monthlyUsed} / ${plan.monthlyFiles}`} />
            <Stat label="Max upload" value={`${plan.maxUploadMb} MB`} />
          </div>
          <div className="pt-2 flex flex-wrap gap-2">
            {quota.plan !== "business" && (
              <Button asChild><Link href="/pricing">Upgrade</Link></Button>
            )}
            <Button asChild variant="outline"><Link href="/pricing">Compare plans</Link></Button>
            {quota.plan !== "free" && <ManageSubscriptionButton />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}
