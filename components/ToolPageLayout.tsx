import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UploadDropzone } from "@/components/UploadDropzone";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { findTool } from "@/lib/tools";
import {
  breadcrumbLd,
  faqLd,
  howToLd,
  softwareApplicationLd,
} from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export type ToolPageProps = {
  slug: string;                 // url slug (matches /tools/[slug])
  h1: string;
  intro: string;                // 2-3 sentence direct answer
  uploadRedirect?: string;      // where the upload button sends the user
  multiple?: boolean;
  steps: { name: string; text: string }[];
  whenToUse: string[];
  relatedToolSlugs: string[];   // slugs from lib/tools.ts
  relatedBlogSlugs?: { slug: string; title: string }[];
  faq: { q: string; a: string }[];
  // For metadata + schema
  metaTitle: string;
  metaDescription: string;
  // Optional client-rendered tool runner that replaces the default
  // upload dropzone (used by AI summarizer and chat pages).
  runner?: React.ReactNode;
};

export function ToolPage(props: ToolPageProps) {
  const path = `/tools/${props.slug}`;
  const breadcrumbs = [
    { name: "Tools", path: "/tools" },
    { name: props.h1, path },
  ];
  const related = props.relatedToolSlugs
    .map(findTool)
    .filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];

  const ld = [
    softwareApplicationLd({
      name: `${props.h1} – ${SITE.name}`,
      description: props.metaDescription,
      url: absoluteUrl(path),
    }),
    breadcrumbLd(breadcrumbs),
    howToLd({
      name: props.h1,
      description: props.intro,
      steps: props.steps,
    }),
    faqLd(props.faq),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 grid gap-10 md:grid-cols-2 items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{props.h1}</h1>
            <p className="mt-3 text-lg text-slate-700">{props.intro}</p>
            <div className="mt-5 flex gap-2">
              <Button asChild><Link href="#upload">Upload PDF</Link></Button>
              <Button asChild variant="outline"><Link href="/tools">All tools</Link></Button>
            </div>
            <ul className="mt-6 space-y-2">
              {[
                "Works in your browser",
                "Files isolated to your workspace",
                "No software install required",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div id="upload">
            {props.runner ?? (
              <UploadDropzone redirectTo={props.uploadRedirect ?? "/editor"} multiple={props.multiple} />
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">How to {props.h1.toLowerCase()}</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {props.steps.map((s, i) => (
              <li key={s.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-600 text-white text-sm font-semibold">{i + 1}</div>
                <h3 className="mt-3 font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">When to use this tool</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2 text-slate-700">
            {props.whenToUse.map((u) => (
              <li key={u} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <span className="text-sm">{u}</span>
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Related PDF tools</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((t) => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}

        {props.relatedBlogSlugs && props.relatedBlogSlugs.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Helpful guides</h2>
            <ul className="mt-4 space-y-2">
              {props.relatedBlogSlugs.map((b) => (
                <li key={b.slug}>
                  <Link href={`/blog/${b.slug}`} className="text-brand-700 hover:underline inline-flex items-center gap-1">
                    {b.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {props.faq.map((q) => (
              <details key={q.q} className="group p-5">
                <summary className="cursor-pointer list-none flex justify-between items-center">
                  <span className="font-medium">{q.q}</span>
                  <span className="text-slate-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-slate-600 text-sm">{q.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 mb-4 rounded-2xl bg-brand-50 p-8 text-center">
          <h2 className="text-2xl font-bold">{props.h1.replace(/online$/i, "online")} now</h2>
          <p className="mt-2 text-slate-700">{props.intro.split(".")[0]}.</p>
          <div className="mt-4">
            <Button asChild size="lg"><Link href="#upload">Upload PDF</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
