import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="Merge PDF"
      description="Combine multiple PDFs into a single file. Drag in two or more files to begin."
      redirectTo="/workspace?tool=merge"
      multiple
      steps={["Upload two or more PDFs", "Review the order in the workspace", "Download your merged PDF"]}
    />
  );
}
