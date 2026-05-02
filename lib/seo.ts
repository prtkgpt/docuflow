import type { Metadata } from "next";
import { SITE, absoluteUrl } from "@/lib/site";

type BuildArgs = {
  title: string;
  description: string;
  path: string;            // canonical path, e.g. "/tools/compress-pdf"
  ogTitle?: string;
  ogDescription?: string;
  noindex?: boolean;
};

// Reusable metadata builder so every page gets canonical + OG + Twitter cards
// without repetition. Keeps every URL pinned to https://mypdfkitty.com.
export function buildMetadata(args: BuildArgs): Metadata {
  const url = absoluteUrl(args.path);
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: url },
    metadataBase: new URL(SITE.url),
    openGraph: {
      type: "website",
      url,
      title: args.ogTitle ?? args.title,
      description: args.ogDescription ?? args.description,
      siteName: SITE.name,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: args.ogTitle ?? args.title,
      description: args.ogDescription ?? args.description,
      site: SITE.twitter,
      images: [SITE.ogImage],
    },
    robots: args.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD helpers — return plain objects ready to be serialized into a
// <script type="application/ld+json"> tag.
// ---------------------------------------------------------------------------

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: absoluteUrl("/favicon.svg"),
    sameAs: [],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE.url}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function softwareApplicationLd(opts?: {
  name?: string;
  description?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts?.name ?? SITE.name,
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    url: opts?.url ?? SITE.url,
    description: opts?.description ?? SITE.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: undefined,
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqLd(qas: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function articleLd(opts: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(opts.path) },
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { "@type": "Organization", name: opts.author ?? `${SITE.name} Editorial Team` },
    publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.svg") } },
    image: absoluteUrl(SITE.ogImage),
  };
}

export function howToLd(opts: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function itemListLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}
