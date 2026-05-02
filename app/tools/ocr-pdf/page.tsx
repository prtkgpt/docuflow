import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "OCR PDF Online – Convert Scanned PDFs to Text | MyPDFKitty",
  description:
    "Use OCR to convert scanned PDFs into searchable, selectable text online with MyPDFKitty.",
  path: "/tools/ocr-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="ocr-pdf"
      h1="OCR PDF Online"
      intro="Run OCR (optical character recognition) on a scanned PDF to make it searchable and selectable. Drop a scan and get back text you can copy, search, or feed into AI tools."
      uploadRedirect="/editor"
      metaTitle="OCR PDF Online – Convert Scanned PDFs to Text | MyPDFKitty"
      metaDescription="Use OCR to convert scanned PDFs into searchable, selectable text online with MyPDFKitty."
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
        { q: "How accurate is OCR?", a: "Accuracy depends on the scan quality. Clean, high-contrast scans deliver near-perfect text; faint or skewed scans need light cleanup." },
        { q: "Does OCR support languages other than English?", a: "We're rolling out multi-language OCR. English-language scans work today." },
        { q: "Will the layout be preserved?", a: "OCR focuses on extracting text. To keep the visual layout, also save the original PDF alongside the OCR output." },
      ]}
    />
  );
}
