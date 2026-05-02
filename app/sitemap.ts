import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog";
import { COMPARISONS } from "@/lib/compare";
import { prisma } from "@/lib/db";

const TOOL_SLUGS = [
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "edit-pdf",
  "sign-pdf",
  "pdf-to-word",
  "word-to-pdf",
  "jpg-to-pdf",
  "pdf-to-jpg",
  "ocr-pdf",
  "ai-pdf-summarizer",
  "chat-with-pdf",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const cmsSlugs: string[] = await prisma.blogPost
    .findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    .then((rows) => rows.map((r) => r.slug))
    .catch(() => []);

  const staticPaths: { path: string; priority?: number; changeFreq?: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFreq: "weekly" },
    { path: "/tools", priority: 0.9, changeFreq: "weekly" },
    { path: "/blog", priority: 0.7, changeFreq: "weekly" },
    { path: "/compare", priority: 0.7, changeFreq: "monthly" },
    { path: "/pricing", priority: 0.8, changeFreq: "monthly" },
    { path: "/about", priority: 0.4, changeFreq: "yearly" },
    { path: "/security", priority: 0.5, changeFreq: "yearly" },
    { path: "/privacy", priority: 0.3, changeFreq: "yearly" },
    { path: "/terms", priority: 0.3, changeFreq: "yearly" },
    { path: "/ai-use-cases", priority: 0.6, changeFreq: "monthly" },
  ];

  return [
    ...staticPaths.map((s) => ({
      url: absoluteUrl(s.path),
      lastModified: now,
      changeFrequency: s.changeFreq,
      priority: s.priority,
    })),
    ...TOOL_SLUGS.map((slug) => ({
      url: absoluteUrl(`/tools/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...BLOG_POSTS.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...cmsSlugs.map((slug) => ({
      url: absoluteUrl(`/blog/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...COMPARISONS.map((c) => ({
      url: absoluteUrl(`/compare/${c.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
