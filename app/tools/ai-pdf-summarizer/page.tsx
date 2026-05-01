import { ToolPageLayout } from "@/components/ToolPageLayout";

export default function Page() {
  return (
    <ToolPageLayout
      title="AI PDF Summarizer"
      description="Get a short summary, key takeaways and action items from any PDF in seconds."
      redirectTo="/workspace?tool=summarize"
      bullets={["Short executive summary", "Bulleted highlights", "Action items you can act on"]}
    />
  );
}
