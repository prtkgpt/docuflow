import Link from "next/link";
import { Cat, Github, Twitter, Linkedin } from "lucide-react";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "All PDF Tools", href: "/tools" },
      { label: "AI PDF Summarizer", href: "/tools/ai-pdf-summarizer" },
      { label: "Chat with PDF", href: "/tools/chat-with-pdf" },
      { label: "Pricing", href: "/pricing" },
      { label: "Workspace", href: "/workspace" },
    ],
  },
  {
    title: "Popular tools",
    links: [
      { label: "Compress PDF", href: "/tools/compress-pdf" },
      { label: "Merge PDF", href: "/tools/merge-pdf" },
      { label: "Split PDF", href: "/tools/split-pdf" },
      { label: "Edit PDF", href: "/tools/edit-pdf" },
      { label: "Sign PDF", href: "/tools/sign-pdf" },
      { label: "PDF to Word", href: "/tools/pdf-to-word" },
      { label: "JPG to PDF", href: "/tools/jpg-to-pdf" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "AI Use Cases", href: "/ai-use-cases" },
      { label: "Best PDF Tools", href: "/compare/best-free-pdf-tools" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: `mailto:${SITE.email}` },
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
              <Cat className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold">{SITE.name}</span>
          </Link>
          <p className="mt-3 text-sm text-slate-500">{SITE.shortDescription}</p>
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
          <span>© {SITE.copyrightYear} {SITE.name}. All rights reserved.</span>
          <span>Made for everyday documents.</span>
        </div>
      </div>
    </footer>
  );
}
