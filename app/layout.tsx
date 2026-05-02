import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.defaultTitle,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "PDF editor online",
    "compress PDF",
    "merge PDF",
    "split PDF",
    "edit PDF",
    "sign PDF",
    "PDF to Word",
    "Word to PDF",
    "JPG to PDF",
    "PDF to JPG",
    "OCR PDF",
    "AI PDF summarizer",
    "chat with PDF",
  ],
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.defaultTitle,
    description: SITE.description,
    url: SITE.url,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitter,
    title: SITE.defaultTitle,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        {children}
      </body>
    </html>
  );
}
