import Link from "next/link";
import { Cat, Github, Twitter, Linkedin } from "lucide-react";
import { SITE } from "@/lib/site";

const COLUMNS = [
  {
    title: "Free PDF Tools",
    links: [
      { label: "Sign PDF Online Free", href: "/tools/sign-pdf" },
      { label: "PDF to Word Free", href: "/tools/pdf-to-word" },
      { label: "Compress PDF Free", href: "/tools/compress-pdf" },
      { label: "Merge PDF Free", href: "/tools/merge-pdf" },
      { label: "Split PDF Free", href: "/tools/split-pdf" },
      { label: "Edit PDF Free", href: "/tools/edit-pdf" },
      { label: "Word to PDF Free", href: "/tools/word-to-pdf" },
    ],
  },
  {
    title: "Image & AI",
    links: [
      { label: "JPG to PDF Free", href: "/tools/jpg-to-pdf" },
      { label: "PDF to JPG Free", href: "/tools/pdf-to-jpg" },
      { label: "JPG to PNG Free", href: "/tools/jpg-to-png" },
      { label: "PNG to JPG Free", href: "/tools/png-to-jpg" },
      { label: "AI PDF Summarizer", href: "/tools/ai-pdf-summarizer" },
      { label: "Chat with PDF Free", href: "/tools/chat-with-pdf" },
      { label: "OCR PDF Free", href: "/tools/ocr-pdf" },
    ],
  },
  {
    title: "Alternatives",
    links: [
      { label: "DocuSign alternative", href: "/alternatives/docusign" },
      { label: "Smallpdf alternative", href: "/alternatives/smallpdf" },
      { label: "iLovePDF alternative", href: "/alternatives/ilovepdf" },
      { label: "Adobe Acrobat alternative", href: "/alternatives/adobe-acrobat" },
      { label: "PDFfiller alternative", href: "/alternatives/pdffiller" },
      { label: "All alternatives", href: "/alternatives" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "All free tools", href: "/tools/free" },
      { label: "PDF use cases", href: "/use-cases" },
      { label: "Blog", href: "/blog" },
      { label: "Best PDF tools", href: "/compare/best-free-pdf-tools" },
      { label: "AI use cases", href: "/ai-use-cases" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Tip the kitty 🐱", href: "/tip" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Contact", href: `mailto:${SITE.email}` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="container py-12 grid gap-10 md:grid-cols-3 lg:grid-cols-6">
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
