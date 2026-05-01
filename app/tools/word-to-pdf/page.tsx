import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="Word to PDF"
      description="Convert .doc and .docx documents into universal PDF format."
      redirectTo="/workspace"
    />
  );
}
