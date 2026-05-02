import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "AI PDF Summarizer – Summarize PDFs Online | MyPDFKitty",
  description:
    "Summarize long PDFs with AI. Upload a PDF and get a short summary, key points, takeaways, and action items with MyPDFKitty.",
  path: "/tools/ai-pdf-summarizer",
});

export default function Page() {
  return (
    <ToolPage
      slug="ai-pdf-summarizer"
      h1="AI PDF Summarizer"
      intro="Get a short summary, highlights, key takeaways, and action items from any PDF in seconds. Upload a document, click summarize, and skim the result instead of reading 30 pages."
      uploadRedirect="/editor?tool=summarize"
      metaTitle="AI PDF Summarizer – Summarize PDFs Online | MyPDFKitty"
      metaDescription="Summarize long PDFs with AI. Upload a PDF and get a short summary, key points, takeaways, and action items with MyPDFKitty."
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
        { q: "What types of PDFs work best?", a: "Text-based PDFs work best. For scanned PDFs, run OCR first to extract the text." },
        { q: "Is this included in the Free plan?", a: "AI summaries require a Pro or Business plan. Free accounts can preview the tool layout but need to upgrade to run the model." },
        { q: "How long can the PDF be?", a: "Long PDFs are truncated to fit the model's context. For very long documents, summarize sections separately." },
      ]}
    />
  );
}
