import Link from "next/link";
import { redirect } from "next/navigation";
import { Cat } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return (
      <main className="container py-20 max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <h1 className="text-xl font-bold">Admin only</h1>
          <p className="mt-2 text-sm text-slate-600">{auth.reason}</p>
          <p className="mt-4 text-sm">
            <Link href="/login?callbackUrl=/master-admin" className="text-brand-700 underline">Sign in</Link> with an
            admin email, then return to <code>/master-admin</code>. Configure
            <code className="mx-1 rounded bg-slate-100 px-1">ADMIN_EMAILS</code>
            (comma-separated) in your Vercel project to grant access.
          </p>
        </div>
      </main>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/master-admin" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white"><Cat className="h-4 w-4" /></span>
            <span className="font-semibold">{SITE.name} Admin</span>
          </Link>
          <span className="text-sm text-slate-600">{auth.email}</span>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
