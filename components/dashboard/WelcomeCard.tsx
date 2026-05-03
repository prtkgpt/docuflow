"use client";
import Link from "next/link";
import { useState } from "react";
import { Sparkles, X, FileArchive, Sparkles as SparklesIcon, MessagesSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: FileArchive,
    title: "Compress your first PDF",
    body: "Shrink a PDF for email or upload — runs in seconds, no install.",
    href: "/tools/compress-pdf",
    cta: "Open Compress",
  },
  {
    icon: SparklesIcon,
    title: "Try the AI summarizer",
    body: "Drop a long PDF and get a short summary, key takeaways, and action items.",
    href: "/tools/ai-pdf-summarizer",
    cta: "Try AI summarizer",
  },
  {
    icon: MessagesSquare,
    title: "Chat with a PDF",
    body: "Ask questions about a document and get answers cited to the source pages.",
    href: "/tools/chat-with-pdf",
    cta: "Chat with PDF",
  },
];

export function WelcomeCard({ name }: { name?: string | null }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-white p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800">
            <Sparkles className="h-3 w-3" /> Welcome
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {name ? `Hi ${name}, you're in!` : "You're in!"}
          </h2>
          <p className="mt-1 text-slate-600">
            Pick one of these to get started — most people finish their first task in under 30 seconds.
          </p>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Dismiss" className="text-slate-400 hover:text-slate-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Link
            key={s.title}
            href={s.href}
            className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300 hover:shadow-soft transition"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-100 text-brand-700 text-sm font-semibold">
                {i + 1}
              </span>
              <s.icon className="h-4 w-4 text-brand-700" />
            </div>
            <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
            <p className="mt-1 text-xs text-slate-600">{s.body}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-700 group-hover:underline">
              {s.cta} <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-2">
        <Button asChild variant="outline" size="sm" onClick={() => setOpen(false)}>
          <Link href="/dashboard">Skip the tour</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/#upload">Upload any PDF</Link>
        </Button>
      </div>
    </div>
  );
}
