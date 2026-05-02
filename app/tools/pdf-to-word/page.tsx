import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="PDF to Word"
      description="Convert PDFs into editable .docx files. Tables and formatting are preserved when possible."
      redirectTo="/workspace?tool=summarize"
      bullets={["Editable .docx output", "Preserves text and headings", "Pro: keep complex tables"]}
    />
  );
}
