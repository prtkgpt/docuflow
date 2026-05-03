import { ToolPage } from "@/components/ToolPageLayout";
import { SimpleToolRunner } from "@/components/tools/SimpleToolRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Convert Word to PDF Online Free | MyPDFKitty",
  description:
    "Convert Word documents to PDF online for free. Upload a DOCX file and download a clean PDF.",
  path: "/tools/word-to-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="word-to-pdf"
      h1="Convert Word to PDF Online Free"
      intro="Convert .doc and .docx files into clean, shareable PDFs for free. Drop a Word document and download a PDF you can email, print, or sign."
      runner={
        <SimpleToolRunner
          toolPath="/tools/word-to-pdf"
          endpoint="/api/tools/word-to-pdf"
          cta="Convert to PDF"
          busyLabel="Converting…"
          doneLabel="Your PDF is ready"
        />
      }
      metaTitle="Convert Word to PDF Online Free | MyPDFKitty"
      metaDescription="Convert Word documents to PDF online for free. Upload a DOCX file and download a clean PDF."
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
