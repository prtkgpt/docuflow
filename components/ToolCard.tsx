import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { Badge } from "@/components/ui/badge";

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
          <Icon className="h-5 w-5" />
        </div>
        {tool.pro && <Badge variant="pro">Pro</Badge>}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{tool.name}</h3>
      <p className="mt-1 text-sm text-slate-500">{tool.description}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 opacity-0 transition-opacity group-hover:opacity-100">
        Open tool <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
