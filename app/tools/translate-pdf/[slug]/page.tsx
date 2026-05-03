import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "@/components/ToolPageLayout";
import { TranslateRunner } from "@/components/tools/TranslateRunner";
import { buildMetadata } from "@/lib/seo";
import { LANGUAGES, findBySlug } from "@/lib/i18n/languages";

// Dynamic landing pages for language-pair searches like
// "translate hindi pdf to english" → /tools/translate-pdf/hindi-to-english.
// Generates English-from and English-to combos for the top 25 languages
// (skipping English-to-English).

type Params = { params: { slug: string } };

type Pair = { from: ReturnType<typeof findBySlug>; to: ReturnType<typeof findBySlug>; pretty: string } | null;

function parseSlug(slug: string): Pair {
  const m = slug.match(/^([a-z-]+)-to-([a-z-]+)$/);
  if (!m) return null;
  const from = findBySlug(m[1]);
  const to = findBySlug(m[2]);
  if (!from || !to || from.code === to.code) return null;
  return { from, to, pretty: `${from.name} to ${to.name}` };
}

export async function generateStaticParams() {
  // English ↔ each of the other 24 languages.
  const others = LANGUAGES.filter((l) => l.code !== "en");
  return others
    .flatMap((l) => [
      { slug: `${l.slug}-to-english` },
      { slug: `english-to-${l.slug}` },
    ]);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const pair = parseSlug(params.slug);
  if (!pair || !pair.from || !pair.to) {
    return buildMetadata({
      title: "Translate PDF",
      description: "Translate PDFs online for free.",
      path: `/tools/translate-pdf/${params.slug}`,
      noindex: true,
    });
  }
  const title = `Translate ${pair.from.name} PDF to ${pair.to.name} Online Free | MyPDFKitty`;
  const description = `Translate ${pair.from.name} PDF to ${pair.to.name} online for free with AI. Upload a PDF and download the translated text in seconds.`;
  return buildMetadata({
    title,
    description,
    path: `/tools/translate-pdf/${params.slug}`,
  });
}

export default function Page({ params }: Params) {
  const pair = parseSlug(params.slug);
  if (!pair || !pair.from || !pair.to) notFound();

  const fromName = pair.from!.name;
  const toName = pair.to!.name;

  return (
    <ToolPage
      slug={`translate-pdf/${params.slug}`}
      h1={`Translate ${fromName} PDF to ${toName} Online Free`}
      intro={`Convert a ${fromName} PDF into ${toName} in your browser. Upload a PDF, our AI translates the text, and you can copy the result or download it as a .txt file. Free for everyone — paid plans get higher monthly limits.`}
      runner={<TranslateRunner presetFrom={pair.from!.code} presetTo={pair.to!.code} />}
      metaTitle={`Translate ${fromName} PDF to ${toName} Online Free | MyPDFKitty`}
      metaDescription={`Translate ${fromName} PDF to ${toName} online for free with AI. Upload a PDF and download the translated text in seconds.`}
      steps={[
        { name: `Upload your ${fromName} PDF`, text: `Drop the ${fromName} PDF you want to translate.` },
        { name: "AI translates the text", text: `MyPDFKitty extracts the ${fromName} text and asks the AI to translate it to ${toName}.` },
        { name: `Read or download in ${toName}`, text: `Copy the ${toName} translation or download it as a .txt file.` },
      ]}
      whenToUse={[
        `You received a ${fromName} contract, letter, or document and need to read it in ${toName}.`,
        `You're studying or doing research in ${fromName} and want a quick ${toName} translation.`,
        `You're sending a ${fromName} draft to a ${toName}-speaking colleague or client.`,
        `You want to summarize a ${fromName} PDF — translate it first, then run the AI Summarizer.`,
      ]}
      relatedToolSlugs={["ocr-pdf", "ai-summarizer", "chat-pdf", "pdf-to-word"]}
      relatedBlogSlugs={[
        { slug: `how-to-translate-${pair.from!.slug}-pdf-to-${pair.to!.slug}`, title: `How to translate ${fromName} PDF to ${toName} online (free)` },
      ]}
      faq={[
        { q: `How accurate is ${fromName} → ${toName} translation?`, a: `Modern AI translation is strong for everyday documents. For legal, medical, or technical content, always have a native ${toName} speaker review the translation before use.` },
        { q: `Will my PDF layout be preserved?`, a: "Paragraphs and lists are preserved. Tables, headers, and complex layouts may flatten — for documents where layout matters, paste the translation into the original PDF using the editor." },
        { q: "Is this really free?", a: "Free users get 1 translation per month. Paid plans (Kitty Plus from $2.99/mo) include 25–250 translations per month." },
        { q: "What about scanned PDFs?", a: `If your ${fromName} PDF is a scan, run OCR PDF first to extract the text, then translate. OCR runs in your browser and works for ${fromName} too.` },
      ]}
    />
  );
}
