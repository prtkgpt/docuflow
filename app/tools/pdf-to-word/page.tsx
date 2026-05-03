import { ToolPage } from "@/components/ToolPageLayout";
import { SimpleToolRunner } from "@/components/tools/SimpleToolRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "PDF to Word Converter Online | MyPDFKitty",
  description:
    "Convert PDF files to editable Word documents online. Use MyPDFKitty to turn PDFs into DOCX files quickly.",
  path: "/tools/pdf-to-word",
});

export default function Page() {
  return (
    <ToolPage
      slug="pdf-to-word"
      h1="PDF to Word Converter"
      intro="Convert PDFs into editable .docx files in your browser. Drop a PDF, MyPDFKitty extracts the text, and you can keep editing in Word, Google Docs, or Pages."
      runner={
        <SimpleToolRunner
          toolPath="/tools/pdf-to-word"
          endpoint="/api/tools/to-word"
          cta="Convert to Word"
          busyLabel="Converting…"
          doneLabel="Your Word document is ready"
        />
      }
      metaTitle="PDF to Word Converter Online | MyPDFKitty"
      metaDescription="Convert PDF files to editable Word documents online. Use MyPDFKitty to turn PDFs into DOCX files quickly."
      steps={[
        { name: "Upload your PDF", text: "Drop the PDF you want to turn into a Word document." },
        { name: "Convert", text: "MyPDFKitty extracts the text content into an editable file." },
        { name: "Download .docx", text: "Open the result in Word, Google Docs, or Pages and keep editing." },
      ]}
      whenToUse={[
        "You need to update an old report saved as a PDF.",
        "You're translating or rewriting copy that lives inside a PDF.",
        "Someone sent you a contract and you need to mark up changes.",
        "You're moving content from a PDF into a CMS or doc tool.",
      ]}
      relatedToolSlugs={["word-to-pdf", "pdf-to-jpg", "edit-pdf", "ocr-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-convert-pdf-to-word", title: "How to convert PDF to Word online" },
        { slug: "how-to-convert-scanned-pdf-to-text", title: "How to convert a scanned PDF to text" },
      ]}
      faq={[
        { q: "Will my formatting be preserved?", a: "Plain text and basic formatting are preserved. Complex tables and multi-column layouts may need light cleanup in Word." },
        { q: "Can I convert a scanned PDF?", a: "For scanned PDFs, run OCR first using the OCR PDF tool (coming soon), then convert to Word." },
        { q: "Is my file deleted after conversion?", a: "Files are stored in your private workspace. Delete a file from your dashboard at any time." },
      ]}
    />
  );
}
