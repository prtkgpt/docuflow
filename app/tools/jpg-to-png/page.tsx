import { ToolPage } from "@/components/ToolPageLayout";
import { ImageConvertRunner } from "@/components/tools/ImageConvertRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Convert JPG to PNG Online Free | MyPDFKitty",
  description:
    "Convert JPG images to PNG online for free. Upload your image and download a PNG file with MyPDFKitty.",
  path: "/tools/jpg-to-png",
});

export default function Page() {
  return (
    <ToolPage
      slug="jpg-to-png"
      h1="Convert JPG to PNG Online Free"
      intro="Convert JPG images to PNG in your browser. The conversion runs entirely on your device — your image never leaves your computer."
      runner={<ImageConvertRunner from="jpg" to="png" toolPath="/tools/jpg-to-png" />}
      metaTitle="Convert JPG to PNG Online Free | MyPDFKitty"
      metaDescription="Convert JPG images to PNG online for free. Upload your image and download a PNG file with MyPDFKitty."
      steps={[
        { name: "Upload your JPG", text: "Drop a JPG file onto the upload box or browse to select it." },
        { name: "Convert", text: "Your browser re-encodes the image as a PNG locally." },
        { name: "Download the PNG", text: "Save the PNG and share it anywhere that needs lossless format or transparency support." },
      ]}
      whenToUse={[
        "You need a lossless image for design work or print.",
        "A web tool only accepts PNG uploads.",
        "You're preparing transparent assets later in an editor.",
        "You want to avoid JPEG compression artifacts after multiple edits.",
      ]}
      relatedToolSlugs={["png-to-jpg", "jpg-to-pdf", "pdf-to-jpg", "compress-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-convert-jpg-to-png-online-free", title: "How to convert JPG to PNG online (free)" },
      ]}
      faq={[
        { q: "Is this really free?", a: "Yes. The conversion runs in your browser, so there's no server cost and no per-conversion limit." },
        { q: "Will the image quality change?", a: "JPG → PNG is lossless on top of the JPG you started with — but PNG can't recover detail JPG already discarded." },
        { q: "What's the maximum file size?", a: "Up to 100 MB. Very large images may briefly hang the tab while the browser encodes them." },
      ]}
    />
  );
}
