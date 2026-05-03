import { ToolPage } from "@/components/ToolPageLayout";
import { ImageConvertRunner } from "@/components/tools/ImageConvertRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Convert PNG to JPG Online Free | MyPDFKitty",
  description:
    "Convert PNG images to JPG online for free. Upload your image and download a smaller JPG file with MyPDFKitty.",
  path: "/tools/png-to-jpg",
});

export default function Page() {
  return (
    <ToolPage
      slug="png-to-jpg"
      h1="Convert PNG to JPG Online Free"
      intro="Convert PNG images to JPG in your browser. The conversion runs entirely on your device — JPG output is smaller and easier to share, with PNG transparency flattened on white."
      runner={<ImageConvertRunner from="png" to="jpg" toolPath="/tools/png-to-jpg" />}
      metaTitle="Convert PNG to JPG Online Free | MyPDFKitty"
      metaDescription="Convert PNG images to JPG online for free. Upload your image and download a smaller JPG file with MyPDFKitty."
      steps={[
        { name: "Upload your PNG", text: "Drop a PNG file onto the upload box or browse to select it." },
        { name: "Convert", text: "Your browser re-encodes the image as JPG locally; transparent areas are flattened on white." },
        { name: "Download the JPG", text: "Save the smaller JPG and use it on email, web, or chat apps." },
      ]}
      whenToUse={[
        "You need a smaller file for email or web upload.",
        "An online form only accepts JPG.",
        "You're sending photos and don't need transparency.",
        "You want to flatten a screenshot's transparent background.",
      ]}
      relatedToolSlugs={["jpg-to-png", "jpg-to-pdf", "pdf-to-jpg", "compress-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-convert-jpg-to-png-online-free", title: "How to convert JPG to PNG online (free)" },
      ]}
      faq={[
        { q: "Is this really free?", a: "Yes. The conversion runs in your browser at no cost." },
        { q: "Why does my JPG have a white background?", a: "JPG doesn't support transparency, so transparent pixels in the PNG are flattened on white during conversion." },
        { q: "Will the image lose quality?", a: "JPG uses lossy compression at 95% quality by default — fine for most photos, less ideal for sharp text or graphics." },
      ]}
    />
  );
}
