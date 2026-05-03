import { ToolPage } from "@/components/ToolPageLayout";
import { SimpleToolRunner } from "@/components/tools/SimpleToolRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Word to PDF Converter Online | MyPDFKitty",
  description:
    "Convert Word documents to PDF online. Use MyPDFKitty to create clean, shareable PDFs from DOCX files.",
  path: "/tools/word-to-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="word-to-pdf"
      h1="Word to PDF Converter"
      intro="Convert .doc and .docx files into clean, shareable PDFs. Drop a Word document and we'll turn it into a PDF you can email, print, or sign."
      runner={
        <SimpleToolRunner
          toolPath="/tools/word-to-pdf"
          endpoint="/api/tools/word-to-pdf"
          cta="Convert to PDF"
          busyLabel="Converting…"
          doneLabel="Your PDF is ready"
        />
      }
      metaTitle="Word to PDF Converter Online | MyPDFKitty"
      metaDescription="Convert Word documents to PDF online. Use MyPDFKitty to create clean, shareable PDFs from DOCX files."
      steps={[
        { name: "Upload your Word file", text: "Drop a .doc or .docx file onto the upload box." },
        { name: "Convert", text: "MyPDFKitty rebuilds the document as a PDF with headings, paragraphs, and lists." },
        { name: "Download", text: "Save the PDF and email, sign, or share it anywhere." },
      ]}
      whenToUse={[
        "You're sending a final draft to a client and want them to see the same layout.",
        "An online form requires a PDF instead of a Word file.",
        "You're locking edits before publishing a doc.",
        "You're combining a Word file with other PDFs in one document.",
      ]}
      relatedToolSlugs={["pdf-to-word", "merge-pdf", "compress-pdf", "edit-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-convert-word-to-pdf", title: "How to convert Word to PDF online" },
      ]}
      faq={[
        { q: "Will my formatting be preserved?", a: "Headings, paragraphs, and bullet/numbered lists are preserved. Tables, images, and complex layouts may be simplified — open the result and review before sending." },
        { q: "Can I convert old .doc files?", a: "Yes — both .doc and .docx are supported." },
        { q: "Is there a watermark?", a: "No. The output PDF is clean." },
      ]}
    />
  );
}
