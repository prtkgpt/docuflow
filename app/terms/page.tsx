import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container py-16 max-w-3xl">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="mt-4 text-slate-600">
          Placeholder terms for the DocuFlow MVP. By using DocuFlow you agree not to upload illegal
          content and to use the service in accordance with applicable law. Replace this page with
          your finalized terms before launch.
        </p>
      </main>
      <Footer />
    </>
  );
}
