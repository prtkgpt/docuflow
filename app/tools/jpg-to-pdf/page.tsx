import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="JPG to PDF"
      description="Combine one or more JPG/PNG images into a single PDF document."
      redirectTo="/workspace?tool=merge"
      multiple
    />
  );
}
