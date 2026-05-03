import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Button } from "@/components/ui/button";
import { ToolCard } from "@/components/ToolCard";
import { findTool } from "@/lib/tools";
import { breadcrumbLd, faqLd, howToLd, softwareApplicationLd, buildMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";
import { CheckCircle2, ArrowRight, FileSignature, Mail, Users, Clock } from "lucide-react";

const PATH = "/tools/send-for-signature";
const H1 = "Send PDF for Signature Online — Free";
const INTRO =
  "Send a PDF to anyone for signing — no account required for signers. Add recipients, drop signature, date, and text fields onto the page, then send. Each signer gets a private link by email and you get the fully signed PDF when everyone is done.";

export const metadata = buildMetadata({
  title: `${H1} | ${SITE.name}`,
  description:
    "Send PDFs for signature online — free for up to 10 envelopes per month. Add multiple signers, place fields, and get a signed PDF with audit trail. No download needed.",
  path: PATH,
});

const STEPS = [
  { name: "Upload your PDF", text: "Drop the contract, NDA, offer letter, or any PDF you need signed." },
  { name: "Add recipients & fields", text: "Enter each signer's name and email, then drag signature, date, and text fields onto the page for each one." },
  { name: "Send", text: "Each recipient gets a private signing link by email. They review and sign in their browser — no MyPDFKitty account needed." },
  { name: "Get the signed PDF", text: "When everyone signs, you and your recipients receive the final signed PDF with a tamper-proof audit certificate appended." },
];

const FAQ = [
  {
    q: "Do recipients need a MyPDFKitty account to sign?",
    a: "No. Each recipient gets a unique signing link in their email and can sign in any browser. No sign-up required.",
  },
  {
    q: "Are the signatures legally binding?",
    a: "For most everyday agreements (NDAs, contractor agreements, offer letters, internal approvals), typed and drawn electronic signatures collected this way are accepted under the U.S. ESIGN Act and EU eIDAS. For regulated workflows that require qualified e-signatures, use a service that specializes in legal signing.",
  },
  {
    q: "How many envelopes can I send for free?",
    a: "Up to 10 envelopes per month on the Free plan. Kitty Plus increases that to 50, Pro to 200, and Business to 1,000.",
  },
  {
    q: "Can I send to more than one person?",
    a: "Yes. Add up to 10 recipients per envelope. Each one gets their own fields and their own private signing link.",
  },
  {
    q: "What's in the audit certificate?",
    a: "The final signed PDF includes a certificate page with the envelope ID, document name, every signer's name + email, the timestamp they viewed and signed, and their IP address.",
  },
  {
    q: "Can I cancel an envelope after sending?",
    a: "Yes. Open the envelope from your dashboard and click Cancel. Recipients who haven't signed yet will no longer be able to access the document.",
  },
  {
    q: "Will recipients get reminders?",
    a: "You can send a manual reminder from the envelope page anytime. We rate-limit to one reminder per recipient per hour to avoid spamming.",
  },
];

export default function Page() {
  const breadcrumbs = [
    { name: "Tools", path: "/tools" },
    { name: H1, path: PATH },
  ];
  const related = ["sign-pdf", "edit-pdf", "merge-pdf", "compress-pdf"]
    .map(findTool)
    .filter(Boolean) as NonNullable<ReturnType<typeof findTool>>[];

  const ld = [
    softwareApplicationLd({
      name: `${H1} – ${SITE.name}`,
      description: metadata.description as string,
      url: absoluteUrl(PATH),
    }),
    breadcrumbLd(breadcrumbs),
    howToLd({ name: H1, description: INTRO, steps: STEPS }),
    faqLd(FAQ),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <Header />
      <main className="container py-8 md:py-12">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6 grid gap-10 md:grid-cols-2 items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{H1}</h1>
            <p className="mt-3 text-lg text-slate-700">{INTRO}</p>
            <div className="mt-5 flex gap-2">
              <Button asChild>
                <Link href="/dashboard/envelopes/new">
                  <FileSignature className="h-4 w-4" /> Send a PDF for signature
                </Link>
              </Button>
              <Button asChild variant="outline"><Link href="/pricing">See limits</Link></Button>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-700">
              {[
                "10 free envelopes per month — no credit card",
                "Recipients sign in any browser — no account needed",
                "Up to 10 signers per envelope",
                "Tamper-proof audit certificate on every signed PDF",
                "Drawn or typed signatures, plus date, text, and checkbox fields",
                "All processing on private, isolated workspaces",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold">How it works</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s.name} className="flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{i + 1}</span>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-slate-600">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <Button asChild className="w-full">
                <Link href="/dashboard/envelopes/new">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { Icon: Users, title: "Multi-party signing", text: "Add up to 10 signers per envelope, each with their own fields." },
            { Icon: Mail, title: "Email delivery", text: "Recipients get a private signing link — no MyPDFKitty account required." },
            { Icon: Clock, title: "Real-time status", text: "See exactly who has viewed and signed, and resend reminders in one click." },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <Icon className="h-6 w-6 text-brand-600" />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">When to use it</h2>
          <ul className="mt-4 grid gap-2 md:grid-cols-2 text-sm text-slate-700">
            {[
              "Send NDAs to contractors and freelancers.",
              "Route offer letters to new hires for signature.",
              "Get client sign-off on quotes, SOWs, and proposals.",
              "Collect parental consent forms or waivers.",
              "Have multiple parties initial each page of an agreement.",
              "Get a board resolution signed without printing or scanning.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-600" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-2xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-2 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold">Related tools</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {related.map((t) => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
