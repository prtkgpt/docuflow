import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compress PDF Online – Reduce PDF File Size | MyPDFKitty",
  description:
    "Compress PDF files online with MyPDFKitty. Reduce PDF size for email, uploads, applications, and document sharing without installing software.",
  path: "/tools/compress-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="compress-pdf"
      h1="Compress PDF Online"
      intro="Compress PDFs online to make them smaller and easier to email, upload, or share. Drop your file, choose how aggressive you want the compression, and download a slimmer PDF in seconds."
      uploadRedirect="/editor"
      metaTitle="Compress PDF Online – Reduce PDF File Size | MyPDFKitty"
      metaDescription="Compress PDF files online with MyPDFKitty. Reduce PDF size for email, uploads, applications, and document sharing without installing software."
      steps={[
        { name: "Upload your PDF", text: "Drag and drop your PDF onto the upload box or browse to select it from your computer." },
        { name: "Optimize the file", text: "MyPDFKitty rebuilds the PDF with smaller assets while keeping it readable." },
        { name: "Download the result", text: "Save the compressed PDF and use it for email, applications, or web uploads." },
      ]}
      whenToUse={[
        "Your PDF is too large for Gmail or Outlook attachments.",
        "An online application or job portal rejects files over 5–10 MB.",
        "You're sharing scans, brochures, or reports that don't need print quality.",
        "You want to reduce storage on cloud drives full of PDFs.",
      ]}
      relatedToolSlugs={["merge-pdf", "split-pdf", "edit-pdf", "pdf-to-jpg"]}
      relatedBlogSlugs={[
        { slug: "how-to-compress-a-pdf-online", title: "How to compress a PDF online — step-by-step guide" },
        { slug: "how-to-compress-a-pdf-for-email", title: "How to compress a PDF for email" },
      ]}
      faq={[
        { q: "How do I compress a PDF without losing quality?", a: "Upload your PDF, let MyPDFKitty optimize it, and review the result. Most documents shrink with no visible loss; if quality matters, keep the original and use the smaller copy only for sharing." },
        { q: "What's the maximum file size?", a: "Free accounts can compress PDFs up to 10 MB. Pro raises that to 100 MB and Business to 500 MB." },
        { q: "Is the compressed PDF safe to share?", a: "Yes. Files are uploaded over HTTPS and isolated to your account. Delete a file from your dashboard at any time." },
        { q: "Why is my compressed PDF still large?", a: "Image-heavy PDFs and scans compress less than text. Try splitting the PDF and compressing only the heaviest pages." },
      ]}
    />
  );
}
