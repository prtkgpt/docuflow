import { ToolPage } from "@/components/ToolPageLayout";
import { ComingSoonRunner } from "@/components/tools/ComingSoonRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "OCR PDF Online Free – Convert Scanned PDFs to Text | MyPDFKitty",
  description:
    "Use OCR online to convert scanned PDFs into searchable, selectable text with MyPDFKitty.",
  path: "/tools/ocr-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="ocr-pdf"
      h1="OCR PDF Online Free"
      intro="Run OCR on a scanned PDF to make it searchable. We're getting this one production-ready — marked clearly as beta. For text-based PDFs today, try the AI summarizer."
      runner={
        <ComingSoonRunner
          toolName="OCR PDF"
          fallbackTip={{ label: "Try the AI Summarizer (text PDFs)", href: "/tools/ai-pdf-summarizer" }}
        />
      }
      metaTitle="OCR PDF Online Free – Convert Scanned PDFs to Text | MyPDFKitty"
      metaDescription="Use OCR online to convert scanned PDFs into searchable, selectable text with MyPDFKitty."
      steps={[
        { name: "Upload the scanned PDF", text: "Drop a scan from your phone, scanner, or fax archive." },
        { name: "Run OCR", text: "MyPDFKitty extracts the text from each page." },
        { name: "Use the text", text: "Search, copy, or pass the result to the AI Summarizer or Chat with PDF." },
      ]}
      whenToUse={[
        "You received a scanned contract you can't search.",
        "You're digitizing receipts or invoices for accounting.",
        "You want to translate or summarize text inside a scan.",
        "You're moving a paper archive into a searchable cloud library.",
      ]}
      relatedToolSlugs={["ai-summarizer", "chat-pdf", "pdf-to-word", "edit-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-convert-scanned-pdf-to-text", title: "How to convert a scanned PDF to text" },
        { slug: "how-to-summarize-a-pdf-with-ai", title: "How to summarize a PDF with AI" },
      ]}
      faq={[
        { q: "Why isn't OCR live yet?", a: "Reliable OCR needs careful tuning so we don't return garbage on poor scans. We're working on it." },
        { q: "What can I do today?", a: "If your PDF is text-based (not a scan), the AI Summarizer and Chat with PDF already work." },
      ]}
    />
  );
}
