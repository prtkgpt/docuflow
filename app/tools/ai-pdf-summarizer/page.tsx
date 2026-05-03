import { ToolPage } from "@/components/ToolPageLayout";
import { InlineSummarizer } from "@/components/InlineSummarizer";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "AI PDF Summarizer Free – Summarize PDFs Online | MyPDFKitty",
  description:
    "Summarize PDFs online with AI. Upload a PDF and get a short summary, key points, takeaways, and action items.",
  path: "/tools/ai-pdf-summarizer",
});

export default function Page() {
  return (
    <ToolPage
      slug="ai-pdf-summarizer"
      h1="AI PDF Summarizer Free"
      intro="Get a short summary, highlights, key takeaways, and action items from any PDF in seconds. Free users get 3 summaries per day on PDFs up to ~6 pages of text — upgrade for larger files and higher limits."
      runner={<InlineSummarizer />}
      metaTitle="AI PDF Summarizer Free – Summarize PDFs Online | MyPDFKitty"
      metaDescription="Summarize PDFs online with AI. Upload a PDF and get a short summary, key points, takeaways, and action items."
      steps={[
        { name: "Upload your PDF", text: "Drop a report, paper, ebook, or contract." },
        { name: "Generate the summary", text: "MyPDFKitty extracts the text and asks an AI model for a concise summary." },
        { name: "Skim the highlights", text: "Read the short summary, bullets, takeaways, and suggested action items." },
      ]}
      whenToUse={[
        "You're triaging a 40-page report before a meeting.",
        "You need the gist of a research paper or whitepaper.",
        "You're reviewing a contract and want quick risk callouts.",
        "You want to brief a teammate without reading the whole doc.",
      ]}
      relatedToolSlugs={["chat-pdf", "key-points", "ocr-pdf", "edit-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-summarize-a-pdf-with-ai", title: "How to summarize a PDF with AI" },
        { slug: "how-to-summarize-a-research-paper-with-ai", title: "How to summarize a research paper with AI" },
        { slug: "best-ai-pdf-summarizer-tools", title: "Best AI PDF summarizer tools in 2026" },
      ]}
      faq={[
        { q: "Is this included in the Free plan?", a: "Yes — Free users get 3 summaries per day on PDFs up to ~8,000 characters of text (about 4–6 pages). Pro raises this to 100/day on much larger files; Business is effectively unlimited." },
        { q: "What types of PDFs work best?", a: "Text-based PDFs work best. For scanned PDFs, run OCR first to extract the text." },
        { q: "How long can the PDF be?", a: "Free: ~8,000 characters. Pro: ~200,000 characters (about 80–100 pages). Business: 1,000,000 characters." },
      ]}
    />
  );
}
