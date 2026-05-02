import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="Split PDF"
      description="Extract specific page ranges into a new PDF. Use ranges like 1-3, 5, 8-10."
      redirectTo="/workspace?tool=split"
    />
  );
}
