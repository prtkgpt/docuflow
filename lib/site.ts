// Single source of truth for brand strings, social handles, and absolute URLs.

export const SITE = {
  name: "MyPDFKitty",
  domain: "mypdfkitty.com",
  url: "https://mypdfkitty.com",
  description:
    "MyPDFKitty is a fast, simple, AI-powered PDF toolkit for editing, converting, compressing, signing, summarizing, and organizing PDFs online.",
  shortDescription:
    "A fast, simple PDF toolkit for editing, converting, compressing, signing, and summarizing PDFs online.",
  defaultTitle: "MyPDFKitty – Edit, Convert, Compress & Summarize PDFs Online",
  twitter: "@mypdfkitty",
  email: "hello@mypdfkitty.com",
  copyrightYear: 2026,
  ogImage: "/og.png",
} as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${p}`;
}
