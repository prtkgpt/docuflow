import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="Edit PDF"
      description="Add text, highlights, signatures, images, and more — all in your browser."
      redirectTo="/editor"
      bullets={["Add text & highlights", "Draw or type signatures", "Insert images, checks, X marks", "Save as flat PDF"]}
    />
  );
}
