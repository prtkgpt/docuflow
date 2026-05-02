import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="Sign PDF"
      description="Type, draw, or upload a signature and place it on any page of your PDF."
      redirectTo="/editor"
      bullets={["Type a signature", "Draw on canvas (in workspace)", "Upload a signature image"]}
    />
  );
}
