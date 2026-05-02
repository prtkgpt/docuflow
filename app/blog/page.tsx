import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, breadcrumbLd, itemListLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl, SITE } from "@/lib/site";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "PDF Guides, AI PDF Tips & Document Tutorials | MyPDFKitty",
  description:
    "Read practical PDF guides from MyPDFKitty. Learn how to compress, merge, split, edit, sign, convert, and summarize PDFs online.",
  path: "/blog",
});

const CATEGORIES = [
  "PDF editing",
  "PDF conversion",
  "AI PDF",
  "Business documents",
  "Student PDFs",
] as const;

async function getCmsPosts() {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: [{ publishedAt: "desc" }],
      take: 50,
    });
    return rows;
  } catch {
    return [];
  }
}

export default async function BlogHomePage() {
  const staticPosts = getAllPosts();
  const cmsPosts = await getCmsPosts();

  const all = [
    ...cmsPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: (p.category as (typeof CATEGORIES)[number]) ?? "PDF editing",
      publishedAt: p.publishedAt?.toISOString() ?? p.createdAt.toISOString(),
    })),
    ...staticPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: p.category,
      publishedAt: p.publishedAt,
    })),
  ];

  const featured = all.slice(0, 3);
  const ld = [
    breadcrumbLd([{ name: "Blog", path: "/blog" }]),
    itemListLd(all.map((p) => ({ name: p.title, url: absoluteUrl(`/blog/${p.slug}`) }))),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-10 md:py-14">
        <Breadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
        <div className="mt-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight">{SITE.name} blog</h1>
          <p className="mt-3 text-slate-600">
            Practical guides on editing, converting, compressing, signing, and using AI on PDFs.
          </p>
        </div>

        {featured.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Featured guides</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft hover:border-brand-300 transition"
                >
                  <p className="text-xs uppercase tracking-wide text-brand-700">{p.category}</p>
                  <h3 className="mt-1 font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 line-clamp-3">{p.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {CATEGORIES.map((cat) => {
          const posts = all.filter((p) => p.category === cat);
          if (posts.length === 0) return null;
          return (
            <section key={cat} className="mt-12">
              <h2 className="text-xl font-semibold">{cat} guides</h2>
              <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block px-5 py-4 hover:bg-slate-50"
                    >
                      <p className="font-medium text-slate-900">{p.title}</p>
                      <p className="text-sm text-slate-600 line-clamp-1">{p.description}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
