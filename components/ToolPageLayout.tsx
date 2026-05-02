import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UploadDropzone } from "@/components/UploadDropzone";
import { CheckCircle2 } from "lucide-react";

type Props = {
  title: string;
  description: string;
  steps?: string[];
  bullets?: string[];
  redirectTo?: string;
  multiple?: boolean;
};

export function ToolPageLayout({
  title,
  description,
  steps = ["Upload your PDF", "Configure the tool options", "Download the result"],
  bullets = ["Works in your browser", "Files isolated to your workspace", "No software install required"],
  redirectTo = "/workspace",
  multiple = false,
}: Props) {
  return (
    <>
      <Header />
      <main className="container py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="mt-3 text-lg text-slate-600">{description}</p>
            <ol className="mt-6 space-y-2 text-sm text-slate-700">
              {steps.map((s, i) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <ul className="mt-6 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {b}
                </li>
              ))}
            </ul>
          </div>
          <UploadDropzone redirectTo={redirectTo} multiple={multiple} />
        </div>
      </main>
      <Footer />
    </>
  );
}
