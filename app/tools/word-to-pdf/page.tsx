import { ToolPage } from "@/components/ToolPageLayout";
import { ComingSoonRunner } from "@/components/tools/ComingSoonRunner";
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
      intro="Convert .doc and .docx files into clean, shareable PDFs. We're polishing this one — check back soon."
      runner={
        <ComingSoonRunner
          toolName="Word to PDF"
          fallbackTip={{ label: "Try PDF to Word instead", href: "/tools/pdf-to-word" }}
        />
      }
      metaTitle="Word to PDF Converter Online | MyPDFKitty"
      metaDescription="Convert Word documents to PDF online. Use MyPDFKitty to create clean, shareable PDFs from DOCX files."
      steps={[
        { name: "Upload your Word file", text: "Drop a .doc or .docx file onto the upload box." },
        { name: "Convert", text: "MyPDFKitty exports a PDF that preserves the original layout." },
        { name: "Download the PDF", text: "Use the PDF anywhere." },
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
        { q: "Why isn't this live yet?", a: "DOCX → PDF needs reliable layout rendering. We'd rather ship it right than ship it wrong." },
        { q: "Is there a workaround?", a: "Open the .docx in Word or Google Docs and use 'File → Download as PDF'. We'll match that quality before launch." },
      ]}
    />
  );
}
