import { ToolPage } from "@/components/ToolPageLayout";
import { SimpleToolRunner } from "@/components/tools/SimpleToolRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Convert PDF to Excel Online Free | MyPDFKitty",
  description:
    "Convert PDF tables to Excel (.xlsx) online for free. Upload your PDF and download a spreadsheet with one sheet per page.",
  path: "/tools/pdf-to-excel",
});

export default function Page() {
  return (
    <ToolPage
      slug="pdf-to-excel"
      h1="Convert PDF to Excel Online Free"
      intro="Turn your PDF into a multi-sheet Excel workbook (.xlsx). Each page becomes a sheet, and column-aligned text is split into spreadsheet columns. Best results on clean tabular PDFs — heavily formatted layouts may need light cleanup."
      runner={
        <SimpleToolRunner
          toolPath="/tools/pdf-to-excel"
          endpoint="/api/tools/to-excel"
          cta="Convert to Excel"
          busyLabel="Converting…"
          doneLabel="Your spreadsheet is ready"
        />
      }
      metaTitle="Convert PDF to Excel Online Free | MyPDFKitty"
      metaDescription="Convert PDF tables to Excel (.xlsx) online for free. Upload your PDF and download a spreadsheet with one sheet per page."
      steps={[
        { name: "Upload your PDF", text: "Drop the PDF you want to turn into a spreadsheet." },
        { name: "Convert", text: "MyPDFKitty extracts text from each page and detects column separators." },
        { name: "Download .xlsx", text: "Open in Excel, Google Sheets, or Numbers and clean up if needed." },
      ]}
      whenToUse={[
        "You have a PDF report with tables you need to edit or aggregate.",
        "You're moving statements, invoices, or expense lists into a spreadsheet.",
        "You want to sort or filter data that's currently locked in a PDF.",
      ]}
      relatedToolSlugs={["pdf-to-word", "edit-pdf", "ocr-pdf", "compress-pdf"]}
      faq={[
        { q: "Will my tables convert perfectly?", a: "Clean column-aligned PDFs convert well. Visually styled tables (merged cells, custom borders) often need minor cleanup. Run OCR PDF first if your file is a scan." },
        { q: "Is this beta?", a: "Yes — table extraction is the most heuristic part of PDF conversion. We're improving it. Send us PDFs that didn't convert well and we'll tune." },
        { q: "Multiple sheets?", a: "Yes. Each PDF page becomes a separate sheet (Page 1, Page 2, ...)." },
      ]}
    />
  );
}
