"use client";
import Link from "next/link";
import { Sparkles, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  toolName: string;
  fallbackTip?: { label: string; href: string };
};

export function ComingSoonRunner({ toolName, fallbackTip }: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-6 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
        <Bell className="h-5 w-5" />
      </div>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        <Sparkles className="h-3 w-3" /> Coming soon
      </p>
      <h3 className="mt-3 text-lg font-semibold">{toolName} is in the works</h3>
      <p className="mt-1 text-sm text-slate-600">
        We&apos;re building this carefully so it actually works. While you wait, the rest of MyPDFKitty
        is fully functional.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {fallbackTip && (
          <Button asChild variant="outline">
            <Link href={fallbackTip.href}>
              {fallbackTip.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
        <Button asChild><Link href="/tools">Browse all working tools</Link></Button>
      </div>
    </div>
  );
}
