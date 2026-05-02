import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: `Terms of Service | ${SITE.name}`,
  description: `${SITE.name} terms of service.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container py-16 max-w-3xl">
        <Breadcrumbs items={[{ name: "Terms", path: "/terms" }]} />
        <h1 className="mt-6 text-3xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-slate-600">
          Placeholder terms for {SITE.name}. By using {SITE.name} you agree not to upload illegal
          content and to use the service in accordance with applicable law. Replace this page with
          your finalized terms before launch.
        </p>
      </main>
      <Footer />
    </>
  );
}
