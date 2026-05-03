"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Cat, ChevronDown, LogOut, LayoutDashboard, CreditCard, User, Sparkles } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

const NAV: { label: string; href: string }[] = [
  { label: "Tools", href: "/tools" },
  { label: "Compress PDF", href: "/tools/compress-pdf" },
  { label: "Convert", href: "/tools/pdf-to-word" },
  { label: "AI PDF Tools", href: "/tools/ai-pdf-summarizer" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Cat className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">{SITE.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <AccountArea />
        </div>

        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="container flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
            <MobileAccountArea onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}

function AccountArea() {
  const { data: session, status } = useSession();
  const [openMenu, setOpenMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpenMenu(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (status === "loading") {
    return <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />;
  }

  if (!session?.user) {
    return (
      <>
        <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
        <Button asChild><Link href="/signup">Sign up free</Link></Button>
      </>
    );
  }

  const email = session.user.email ?? "Account";
  const initial = (session.user.name || session.user.email || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenMenu((o) => !o)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-2 py-1.5 hover:bg-slate-50"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-white text-xs font-semibold">{initial}</span>
        <span className="hidden lg:inline text-sm text-slate-700 max-w-[160px] truncate">{email}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>
      {openMenu && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-soft p-1 text-sm">
          <div className="px-3 py-2 text-xs text-slate-500 border-b border-slate-100">{email}</div>
          <MenuItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <MenuItem href="/dashboard/files" icon={LayoutDashboard} label="My files" />
          <MenuItem href="/dashboard/billing" icon={CreditCard} label="Billing" />
          <MenuItem href="/account" icon={User} label="Account settings" />
          <MenuItem href="/pricing" icon={Sparkles} label="Upgrade" />
          <div className="my-1 border-t border-slate-100" />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MobileAccountArea({ onClose }: { onClose: () => void }) {
  const { data: session, status } = useSession();
  if (status === "loading") return <div className="mt-2 h-10 w-full animate-pulse rounded-xl bg-slate-100" />;
  if (!session?.user) {
    return (
      <div className="mt-2 flex gap-2">
        <Button asChild variant="outline" className="flex-1"><Link href="/login" onClick={onClose}>Login</Link></Button>
        <Button asChild className="flex-1"><Link href="/signup" onClick={onClose}>Sign up free</Link></Button>
      </div>
    );
  }
  return (
    <div className="mt-2 flex flex-col gap-1">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        Signed in as {session.user.email}
      </div>
      <Link href="/dashboard" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Dashboard</Link>
      <Link href="/dashboard/files" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">My files</Link>
      <Link href="/dashboard/billing" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Billing</Link>
      <Link href="/account" onClick={onClose} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Account</Link>
      <button
        onClick={() => { onClose(); signOut({ callbackUrl: "/" }); }}
        className="rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
      >
        Sign out
      </button>
    </div>
  );
}

function MenuItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100">
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );
}
