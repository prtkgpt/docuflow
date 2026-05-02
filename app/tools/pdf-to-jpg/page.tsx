import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="PDF to JPG"
      description="Render every page of your PDF as a high-quality JPG image."
      redirectTo="/workspace"
    />
  );
}
