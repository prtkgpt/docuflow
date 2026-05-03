import { ToolPage } from "@/components/ToolPageLayout";
import { SplitRunner } from "@/components/tools/SplitRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Split PDF Online Free – Extract PDF Pages | MyPDFKitty",
  description:
    "Split PDF files online for free. Extract selected pages or create separate PDF files with MyPDFKitty.",
  path: "/tools/split-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="split-pdf"
      h1="Split PDF Online Free"
      intro="Split a PDF into separate files or extract specific pages for free. Use simple page ranges like 1-3, 5, 8-10 to pull out exactly what you need."
      runner={<SplitRunner />}
      metaTitle="Split PDF Online Free – Extract PDF Pages | MyPDFKitty"
      metaDescription="Split PDF files online for free. Extract selected pages or create separate PDF files with MyPDFKitty."
      steps={[
        { name: "Upload your PDF", text: "Drop a single PDF onto the upload box." },
        { name: "Pick pages", text: "Type page ranges like 1-3, 5, 8-10." },
        { name: "Download", text: "Save the new PDF that contains only the pages you selected." },
      ]}
      whenToUse={[
        "You only need a few chapters of a long ebook or report.",
        "You want to split a multi-form PDF into individual files.",
        "You're sending a single section of a contract.",
        "You need to remove duplicate or extra scanned pages.",
      ]}
      relatedToolSlugs={["merge-pdf", "compress-pdf", "edit-pdf", "pdf-to-jpg"]}
      relatedBlogSlugs={[
        { slug: "how-to-split-a-pdf", title: "How to split a PDF online" },
        { slug: "how-to-merge-pdf-files", title: "How to merge PDF files online" },
      ]}
      faq={[
        { q: "How do I extract just one page?", a: "Enter the page number (e.g. 5) in the page field." },
        { q: "Can I split a PDF into multiple files at once?", a: "Yes. Run Split with different ranges (e.g. 1-3 then 4-6) to create separate PDFs." },
        { q: "Will the formatting be preserved?", a: "Yes. The extracted pages keep their original layout, fonts, and images." },
      ]}
    />
  );
}
