import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { PricingClient } from "@/components/pricing/PricingClient";
import { ComparisonSection } from "@/components/pricing/ComparisonSection";
import { PricingFAQ, PricingFaqLd } from "@/components/pricing/PricingFAQ";
import { buildMetadata, breadcrumbLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "MyPDFKitty Pricing – Affordable PDF Tools Starting at $2.99/month",
  description:
    "Start free with MyPDFKitty. Upgrade for AI PDF summaries, larger files, saved history, and team PDF tools starting at just $2.99/month.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Pricing", path: "/pricing" }]), PricingFaqLd()]} />
      <Header />
      <PricingClient />
      <ComparisonSection />
      <PricingFAQ />
      <Footer />
    </>
  );
}
