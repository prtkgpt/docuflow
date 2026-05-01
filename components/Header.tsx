"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV = [
  { label: "Edit PDF", href: "/tools/edit-pdf" },
  { label: "Convert", href: "/tools#convert" },
  { label: "Compress", href: "/tools/compress-pdf" },
  { label: "AI Tools", href: "/tools#ai" },
  { label: "Pricing", href: "/pricing" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-soft">
            <FileText className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">DocuFlow</span>
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
          <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
          <Button asChild><Link href="/#upload">Upload PDF</Link></Button>
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
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" className="flex-1"><Link href="/login">Login</Link></Button>
              <Button asChild className="flex-1"><Link href="/#upload">Upload PDF</Link></Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
