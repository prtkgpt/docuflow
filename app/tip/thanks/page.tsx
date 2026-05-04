import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = buildMetadata({
  title: `Thanks for the tip! — ${SITE.name}`,
  description: "Thank you — your tip helps keep MyPDFKitty's free tools genuinely free.",
  path: "/tip/thanks",
  noindex: true,
});

export default function TipThanksPage({
  searchParams,
}: {
  searchParams: { amount?: string; mock?: string };
}) {
  const cents = Number(searchParams.amount ?? "0");
  const dollars = Number.isFinite(cents) && cents > 0 ? (cents / 100).toFixed(0) : null;
  const isMock = searchParams.mock === "1";

  return (
    <>
      <Header />
      <main className="container py-16 max-w-xl text-center">
        <div className="grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-100 text-amber-700">
            <Heart className="h-8 w-8" />
          </span>
        </div>
        <h1 className="mt-5 text-3xl md:text-4xl font-bold tracking-tight">Thank you 🐱</h1>
        {isMock ? (
          <p className="mt-3 text-slate-700">
            (Mock checkout — Stripe isn't configured on this environment, so no charge happened.)
          </p>
        ) : dollars ? (
          <p className="mt-3 text-slate-700">
            Your <span className="font-semibold">${dollars}</span> tip is in. We really appreciate it — it goes
            straight to keeping the free tools running.
          </p>
        ) : (
          <p className="mt-3 text-slate-700">
            Your tip is in. We really appreciate it.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link href="/tools">Back to the tools</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
