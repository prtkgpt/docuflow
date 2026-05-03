import { ToolPage } from "@/components/ToolPageLayout";
import { PdfToJpgRunner } from "@/components/tools/PdfToJpgRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "PDF to JPG Converter Online | MyPDFKitty",
  description:
    "Convert PDF pages into JPG images online. Use MyPDFKitty to export PDF pages as image files.",
  path: "/tools/pdf-to-jpg",
});

export default function Page() {
  return (
    <ToolPage
      slug="pdf-to-jpg"
      h1="PDF to JPG Converter"
      intro="Convert each page of a PDF into a high-quality JPG image. Download all pages as a ZIP or grab individual ones."
      runner={<PdfToJpgRunner />}
      metaTitle="PDF to JPG Converter Online | MyPDFKitty"
      metaDescription="Convert PDF pages into JPG images online. Use MyPDFKitty to export PDF pages as image files."
      steps={[
        { name: "Upload your PDF", text: "Drop the PDF you want to turn into images." },
        { name: "Convert", text: "MyPDFKitty renders each page as a JPG right in your browser." },
        { name: "Download", text: "Grab one image at a time or download them all as a ZIP." },
      ]}
      whenToUse={[
        "Sharing a single page on Slack, WhatsApp, or social media.",
        "Pulling preview images for a website or store listing.",
        "Embedding a slide or chart into another deck.",
        "Sending a quick visual to someone who can't open PDFs.",
      ]}
      relatedToolSlugs={["jpg-to-pdf", "compress-pdf", "split-pdf", "edit-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-convert-pdf-to-jpg", title: "How to convert PDF to JPG online" },
      ]}
      faq={[
        { q: "Where does the conversion happen?", a: "It runs in your browser — your PDF never leaves your device for this tool." },
        { q: "What's the quality?", a: "Each page is rendered at 2x resolution and exported as a JPG at 92% quality." },
        { q: "Can I get PNGs instead?", a: "PNG export is on the roadmap. For now, JPG is the only output." },
      ]}
    />
  );
}
