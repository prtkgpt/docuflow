import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LayoutDashboard, Files, CreditCard } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/files", label: "Files", icon: Files },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container py-10 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">{children}</section>
      </main>
      <Footer />
    </>
  );
}
