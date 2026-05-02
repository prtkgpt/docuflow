import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="Edit PDF"
      description="Upload a PDF and edit text, images, signatures, and pages directly in your browser."
      redirectTo="/workspace?tool=annotate"
    />
  );
}
