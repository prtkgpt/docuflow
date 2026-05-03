import { ToolPage } from "@/components/ToolPageLayout";
import { SimpleToolRunner } from "@/components/tools/SimpleToolRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Compress PDF Online Free – Reduce PDF Size | MyPDFKitty",
  description:
    "Compress PDF files online for free. Reduce PDF file size for email, uploads, applications, and sharing with MyPDFKitty.",
  path: "/tools/compress-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="compress-pdf"
      h1="Compress PDF Online Free"
      intro="Compress PDFs online for free to make them smaller and easier to email, upload, or share. Drop your file and download a slimmer PDF in seconds."
      runner={
        <SimpleToolRunner
          toolPath="/tools/compress-pdf"
          endpoint="/api/tools/compress"
          cta="Compress PDF"
          busyLabel="Optimizing…"
          doneLabel="Your compressed PDF is ready"
        />
      }
      metaTitle="Compress PDF Online Free – Reduce PDF Size | MyPDFKitty"
      metaDescription="Compress PDF files online for free. Reduce PDF file size for email, uploads, applications, and sharing with MyPDFKitty."
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
        { q: "How much smaller will my PDF get?", a: "Text-only PDFs are usually already small. Image-heavy PDFs and scans see the biggest savings. We always show both the original and the new size so you can decide whether to use the result." },
        { q: "What's the maximum file size?", a: "Free accounts can compress PDFs up to 10 MB. Pro raises that to 100 MB and Business to 500 MB." },
        { q: "Is the compressed PDF safe to share?", a: "Yes. Files are uploaded over HTTPS and isolated to your account. Delete a file from your dashboard at any time." },
        { q: "Why is my compressed PDF still large?", a: "Image-heavy PDFs and scans compress less than text. Try splitting the PDF and compressing only the heaviest pages." },
      ]}
    />
  );
}
