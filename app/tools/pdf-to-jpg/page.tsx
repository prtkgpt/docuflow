import { ToolPage } from "@/components/ToolPageLayout";
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
      intro="Convert each page of a PDF into a high-quality JPG image. Great for previews, slides, and sharing single pages on social or chat."
      uploadRedirect="/editor"
      metaTitle="PDF to JPG Converter Online | MyPDFKitty"
      metaDescription="Convert PDF pages into JPG images online. Use MyPDFKitty to export PDF pages as image files."
      steps={[
        { name: "Upload your PDF", text: "Drop the PDF you want to turn into images." },
        { name: "Pick pages", text: "Choose all pages or specific ranges." },
        { name: "Download the JPGs", text: "Get one JPG per page, ready to share." },
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
        { q: "What's the resolution of the JPGs?", a: "Each page exports at a high enough resolution for screens and standard sharing. Use the editor's zoom to validate fidelity." },
        { q: "Can I get PNGs instead?", a: "Yes — pick the PNG option from the Convert tools menu." },
        { q: "Can I export only one page?", a: "Yes. Use Split PDF to extract the page first, then convert that PDF to JPG." },
      ]}
    />
  );
}
