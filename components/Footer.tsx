import Link from "next/link";
import { FileText, Github, Twitter, Linkedin } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "All tools", href: "/tools" },
      { label: "Pricing", href: "/pricing" },
      { label: "Workspace", href: "/workspace" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Edit PDF", href: "/tools/edit-pdf" },
      { label: "Compress PDF", href: "/tools/compress-pdf" },
      { label: "Merge PDF", href: "/tools/merge-pdf" },
      { label: "Sign PDF", href: "/tools/sign-pdf" },
      { label: "AI Summarizer", href: "/tools/ai-pdf-summarizer" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "mailto:hello@docuflow.app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="container py-12 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <FileText className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">DocuFlow</span>
          </Link>
          <p className="mt-3 text-sm text-slate-500">
            A fast, secure PDF toolkit for everyday documents.
          </p>
          <div className="mt-4 flex gap-3 text-slate-400">
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" aria-label="GitHub"><Github className="h-5 w-5" /></Link>
            <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-600 hover:text-slate-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200">
        <div className="container py-6 text-xs text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} DocuFlow. All rights reserved.</span>
          <span>Made for everyday documents.</span>
        </div>
      </div>
    </footer>
  );
}
