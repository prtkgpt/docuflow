import { ToolPage } from "@/components/ToolPageLayout";
import { OcrRunner } from "@/components/tools/OcrRunner";
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
      intro="Run OCR on a scanned PDF to extract searchable, selectable text. The OCR engine runs entirely in your browser — your scan never leaves your device."
      runner={<OcrRunner />}
      metaTitle="OCR PDF Online Free – Convert Scanned PDFs to Text | MyPDFKitty"
      metaDescription="Use OCR online to convert scanned PDFs into searchable, selectable text with MyPDFKitty."
      steps={[
        { name: "Upload the scanned PDF", text: "Drop a scan from your phone, scanner, or fax archive." },
        { name: "Run OCR locally", text: "The Tesseract OCR engine reads text from each page in your browser." },
        { name: "Download .txt", text: "Save the text and feed it into the AI Summarizer or Chat with PDF." },
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
        { q: "Does this run on a server?", a: "No — Tesseract.js runs entirely in your browser. Your scan never leaves your device, which is why we feel comfortable offering OCR for free." },
        { q: "How accurate is it?", a: "Clean, high-contrast scans deliver near-perfect text. Faint or skewed scans may need a clearer photo. We use the English model by default; multi-language support is on the roadmap." },
        { q: "Why is the first run slow?", a: "Tesseract downloads a ~10 MB language model on first use, then caches it. Subsequent runs are much faster." },
      ]}
    />
  );
}
