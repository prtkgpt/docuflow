import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: `Privacy Policy | ${SITE.name}`,
  description: `${SITE.name} privacy policy: what we collect and how we use it.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container py-16 max-w-3xl prose prose-slate">
        <Breadcrumbs items={[{ name: "Privacy", path: "/privacy" }]} />
        <h1 className="mt-6 text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-slate-600">
          This is a placeholder privacy policy for {SITE.name}. Replace with your finalized policy
          before launch. We collect only what is needed to provide the service: your email, the files
          you upload, and basic usage analytics.
        </p>
        <h2 className="mt-8 text-xl font-semibold">Data we store</h2>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          <li>Account email and display name.</li>
          <li>Files you upload, until you delete them.</li>
          <li>Tool usage events (for analytics and quotas).</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
