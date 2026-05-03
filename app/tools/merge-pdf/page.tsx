import { ToolPage } from "@/components/ToolPageLayout";
import { MergeRunner } from "@/components/tools/MergeRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Merge PDF Online – Combine PDF Files | MyPDFKitty",
  description:
    "Merge multiple PDF files into one document online. Upload, reorder, combine, and download your merged PDF with MyPDFKitty.",
  path: "/tools/merge-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="merge-pdf"
      h1="Merge PDF Online"
      intro="Merge two or more PDFs into a single file in your browser. Drop multiple PDFs, drag to reorder them, and download the combined document."
      runner={<MergeRunner endpoint="/api/tools/merge" toolPath="/tools/merge-pdf" cta="Merge PDFs" busyLabel="Merging…" />}
      metaTitle="Merge PDF Online – Combine PDF Files | MyPDFKitty"
      metaDescription="Merge multiple PDF files into one document online. Upload, reorder, combine, and download your merged PDF with MyPDFKitty."
      steps={[
        { name: "Upload PDFs", text: "Drop two or more PDFs onto the upload box. You can also add scans, contracts, or invoices." },
        { name: "Reorder them", text: "Drag the file rows to set the order you want." },
        { name: "Download the merged PDF", text: "Click Merge and save one combined PDF you can email or upload anywhere." },
      ]}
      whenToUse={[
        "You're combining receipts or invoices into one expense report.",
        "You need to send a single PDF to a client instead of three.",
        "You want to merge a cover letter and resume into one document.",
        "You're consolidating multi-part scans from a phone or scanner.",
      ]}
      relatedToolSlugs={["split-pdf", "compress-pdf", "edit-pdf", "jpg-to-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-merge-pdf-files", title: "How to merge PDF files online" },
        { slug: "how-to-compress-a-pdf-for-email", title: "How to compress a PDF for email" },
      ]}
      faq={[
        { q: "How many PDFs can I merge at once?", a: "You can merge as many PDFs as you can upload within your plan's file limit." },
        { q: "Can I reorder the pages?", a: "Yes. Drag the file rows on this page before clicking Merge." },
        { q: "Is there a watermark on merged PDFs?", a: "No. Merged PDFs are clean — no watermark." },
      ]}
    />
  );
}
