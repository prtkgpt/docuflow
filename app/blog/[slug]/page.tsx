import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { findTool } from "@/lib/tools";
import { getPost, BLOG_POSTS, type BlogPost } from "@/lib/blog";
import {
  buildMetadata,
  breadcrumbLd,
  articleLd,
  faqLd,
  howToLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Params = { params: { slug: string } };

async function loadPost(slug: string): Promise<BlogPost | null> {
  const stat = getPost(slug);
  if (stat) return stat;
  try {
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    if (!row || !row.published) return null;
    return {
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: (row.category as BlogPost["category"]) ?? "PDF editing",
      publishedAt: (row.publishedAt ?? row.createdAt).toISOString().slice(0, 10),
      updatedAt: (row.updatedAt ?? row.createdAt).toISOString().slice(0, 10),
      primaryToolHref: row.primaryToolHref ?? "/tools",
      primaryToolLabel: row.primaryToolLabel ?? "Open tool",
      relatedToolSlugs: (row.relatedToolSlugs ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      faq: (() => {
        try { return JSON.parse(row.faqJson || "[]"); } catch { return []; }
      })(),
      answer: row.answer ?? row.description,
      body: [{ type: "p", text: row.body }],
    };
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await loadPost(params.slug);
  if (!post) return buildMetadata({ title: "Guide not found", description: "", path: `/blog/${params.slug}`, noindex: true });
  return buildMetadata({
    title: `${post.title} | ${SITE.name}`,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Params) {
  const post = await loadPost(params.slug);
  if (!post) notFound();

  const breadcrumbs = [
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  const ld: Record<string, unknown>[] = [
    breadcrumbLd(breadcrumbs),
    articleLd({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
    }),
  ];
  if (post.faq.length) ld.push(faqLd(post.faq));
  if (post.howToSteps && post.howToSteps.length)
    ld.push(howToLd({ name: post.title, description: post.answer, steps: post.howToSteps }));

  const related = post.relatedToolSlugs
    .map(findTool)
    .filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12 max-w-3xl">
        <Breadcrumbs items={breadcrumbs} />
        <p className="mt-6 text-xs uppercase tracking-wide text-brand-700">{post.category}</p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-500">
          By {SITE.name} Editorial Team · Updated {post.updatedAt ?? post.publishedAt}
        </p>

        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-800">Quick answer</p>
          <p className="mt-1 text-slate-800">{post.answer}</p>
          <div className="mt-4">
            <Button asChild size="sm"><Link href={post.primaryToolHref}>{post.primaryToolLabel}</Link></Button>
          </div>
        </div>

        <article className="prose prose-slate mt-8 max-w-none">
          {post.body.map((b, i) => {
            if (b.type === "p") return <p key={i} className="text-slate-700 leading-relaxed">{b.text}</p>;
            if (b.type === "h2") return <h2 key={i} className="mt-8 text-2xl font-bold">{b.text}</h2>;
            if (b.type === "h3") return <h3 key={i} className="mt-6 text-xl font-semibold">{b.text}</h3>;
            if (b.type === "ul") return <ul key={i} className="mt-3 list-disc pl-5 space-y-1 text-slate-700">{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
            if (b.type === "ol") return <ol key={i} className="mt-3 list-decimal pl-5 space-y-1 text-slate-700">{b.items.map((it, j) => <li key={j}>{it}</li>)}</ol>;
            if (b.type === "callout") return (
              <aside key={i} className="my-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{b.text}</aside>
            );
            return null;
          })}
        </article>

        {post.howToSteps && post.howToSteps.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Step-by-step</h2>
            <ol className="mt-4 grid gap-3">
              {post.howToSteps.map((s, i) => (
                <li key={s.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                  <span className="text-xs font-semibold text-brand-700">Step {i + 1}</span>
                  <p className="font-semibold mt-1">{s.name}</p>
                  <p className="text-sm text-slate-600 mt-1">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">Related tools</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {related.map((t) => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}

        {post.relatedPostSlug && (() => {
          const rp = getPost(post.relatedPostSlug);
          if (!rp) return null;
          return (
            <section className="mt-10">
              <h2 className="text-2xl font-bold">Keep reading</h2>
              <Link href={`/blog/${rp.slug}`} className="mt-4 block rounded-2xl border border-slate-200 bg-white p-5 shadow-soft hover:border-brand-300">
                <p className="text-xs uppercase tracking-wide text-brand-700">{rp.category}</p>
                <p className="mt-1 font-semibold">{rp.title}</p>
                <p className="text-sm text-slate-600 mt-1">{rp.description}</p>
              </Link>
            </section>
          );
        })()}

        {post.faq.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold">FAQ</h2>
            <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {post.faq.map((q) => (
                <details key={q.q} className="group p-5">
                  <summary className="cursor-pointer list-none flex justify-between items-center">
                    <span className="font-medium">{q.q}</span>
                    <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{q.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-2xl bg-brand-50 p-6 text-center">
          <h2 className="text-xl font-bold">Try it now</h2>
          <p className="mt-1 text-slate-700">{post.answer.split(".")[0]}.</p>
          <div className="mt-4">
            <Button asChild size="lg"><Link href={post.primaryToolHref}>{post.primaryToolLabel}</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
