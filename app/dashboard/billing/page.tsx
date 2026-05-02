import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/plans";

export default function BillingPage() {
  const currentPlan = "free";
  const plan = PLANS.find((p) => p.id === currentPlan)!;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-sm text-slate-600">Manage your MyPDFKitty subscription and usage.</p>
      </div>
      <Card>
        <CardHeader>
          <CardDescription>Current plan</CardDescription>
          <CardTitle>{plan.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div className="grid gap-2 sm:grid-cols-2">
            <Stat label="Files / month" value={`${plan.monthlyFiles}`} />
            <Stat label="Max upload" value={`${plan.maxUploadMb} MB`} />
          </div>
          <div className="pt-2 flex gap-2">
            <Button asChild><Link href="/pricing">Upgrade</Link></Button>
            <Button asChild variant="outline"><Link href="/pricing">Compare plans</Link></Button>
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
