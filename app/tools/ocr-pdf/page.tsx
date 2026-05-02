import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="OCR PDF"
      description="Make scanned PDFs searchable. We extract text from each page using OCR."
      redirectTo="/workspace?tool=summarize"
      bullets={["Search inside scans", "Copy/paste text", "Pro: high-accuracy OCR"]}
    />
  );
}
