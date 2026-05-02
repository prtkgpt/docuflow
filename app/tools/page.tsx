import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToolGrid } from "@/components/ToolGrid";

export default function ToolsPage() {
  return (
    <>
      <Header />
      <main className="container py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">All PDF tools</h1>
          <p className="mt-3 text-slate-600">
            Pick a tool to edit, convert, sign or summarize your PDF. New tools are added regularly.
          </p>
        </div>
        <div className="mt-10"><ToolGrid /></div>
      </main>
      <Footer />
    </>
  );
}
