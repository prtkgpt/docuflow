import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container py-16 max-w-3xl">
        <h1 className="text-4xl font-bold">About DocuFlow</h1>
        <p className="mt-4 text-slate-600">
          DocuFlow is an all-in-one PDF toolkit for everyday document work — editing, converting,
          signing, compressing, and summarizing PDFs with AI. We're building a faster, cleaner
          alternative to clunky desktop software.
        </p>
        <h2 className="mt-10 text-2xl font-semibold">Our principles</h2>
        <ul className="mt-3 space-y-2 text-slate-700">
          <li>• <span className="font-medium">Private by default.</span> Files are isolated to your account.</li>
          <li>• <span className="font-medium">Fast.</span> Tools run in your browser whenever possible.</li>
          <li>• <span className="font-medium">Honest.</span> We don't claim things we haven't built.</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
