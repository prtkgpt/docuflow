import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="inline-flex items-center gap-1 hover:text-slate-900">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            {i === items.length - 1 ? (
              <span className="text-slate-700">{c.name}</span>
            ) : (
              <Link href={c.path} className="hover:text-slate-900">{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
