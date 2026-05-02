import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Shrink large PDFs while keeping quality intact. Great for email and web sharing."
      redirectTo="/workspace?tool=compress"
    />
  );
}
