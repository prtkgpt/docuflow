import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Edit PDF Online – Add Text, Images & Notes | MyPDFKitty",
  description:
    "Edit PDFs online with MyPDFKitty. Add text, signatures, images, notes, highlights, and page changes directly in your browser.",
  path: "/tools/edit-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="edit-pdf"
      h1="Edit PDF Online"
      intro="Edit PDFs in your browser. Add text, signatures, images, highlights and notes; reorder, rotate, or delete pages — and save the result as a new PDF."
      uploadRedirect="/editor"
      metaTitle="Edit PDF Online – Add Text, Images & Notes | MyPDFKitty"
      metaDescription="Edit PDFs online with MyPDFKitty. Add text, signatures, images, notes, highlights, and page changes directly in your browser."
      steps={[
        { name: "Upload your PDF", text: "Drop a PDF onto the upload box to open it in the editor." },
        { name: "Add edits", text: "Use the toolbar to add text, highlights, signatures, images, notes, links, and page changes." },
        { name: "Save & download", text: "Click Done and download a flattened PDF with your edits baked in." },
      ]}
      whenToUse={[
        "Filling out a PDF form that wasn't designed for typing.",
        "Adding a note or highlight to a contract before sending it back.",
        "Inserting a signature, photo, or stamp on a single page.",
        "Quickly reordering, rotating, or deleting pages.",
      ]}
      relatedToolSlugs={["sign-pdf", "merge-pdf", "split-pdf", "compress-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-edit-a-pdf-online", title: "How to edit a PDF online" },
        { slug: "how-to-sign-a-pdf-online", title: "How to sign a PDF online" },
      ]}
      faq={[
        { q: "Can I edit existing text inside the PDF?", a: "You can add new text, signatures, highlights and shapes today. Rewriting the original text inside the PDF is on the roadmap." },
        { q: "Are my edits permanent?", a: "Edits are flattened into the saved PDF when you click Done. You can keep the original by saving the result as a new file." },
        { q: "Can I edit a scanned PDF?", a: "Yes — you can annotate any PDF. To make scanned text searchable first, use the OCR PDF tool." },
      ]}
    />
  );
}
