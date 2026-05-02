import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "JPG to PDF Converter Online | MyPDFKitty",
  description:
    "Convert JPG images into a PDF online. Combine photos, scans, and images into one PDF with MyPDFKitty.",
  path: "/tools/jpg-to-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="jpg-to-pdf"
      h1="JPG to PDF Converter"
      intro="Combine one or more JPG or PNG images into a single PDF. Great for receipts, photos of forms, and quick scans from your phone."
      uploadRedirect="/editor"
      multiple
      metaTitle="JPG to PDF Converter Online | MyPDFKitty"
      metaDescription="Convert JPG images into a PDF online. Combine photos, scans, and images into one PDF with MyPDFKitty."
      steps={[
        { name: "Upload your images", text: "Drop one or more JPGs or PNGs onto the upload box." },
        { name: "Order the pages", text: "Use Manage Pages in the editor to reorder, rotate, or remove images." },
        { name: "Download the PDF", text: "Save your photos as one tidy PDF you can email or print." },
      ]}
      whenToUse={[
        "You took photos of receipts and need one PDF for an expense report.",
        "You scanned a multi-page document with your phone camera.",
        "You're attaching photos to a job application or insurance claim.",
        "You want to combine product photos for a supplier or client.",
      ]}
      relatedToolSlugs={["pdf-to-jpg", "merge-pdf", "compress-pdf", "edit-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-convert-jpg-to-pdf", title: "How to convert JPG to PDF online" },
      ]}
      faq={[
        { q: "Can I add multiple images at once?", a: "Yes. Drop multiple JPG/PNG files together; each image becomes a page." },
        { q: "What image formats are supported?", a: "JPG and PNG today. HEIC support is on the roadmap." },
        { q: "Can I rotate or reorder images?", a: "Yes — use Manage Pages in the editor to drag pages and rotate them." },
      ]}
    />
  );
}
