import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container py-16 max-w-3xl prose prose-slate">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-4 text-slate-600">
          This is a placeholder privacy policy for the DocuFlow MVP. Replace with your finalized policy
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
