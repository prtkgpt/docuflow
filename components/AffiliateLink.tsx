import { ExternalLink } from "lucide-react";
import { findPartner, isAffiliate } from "@/lib/affiliates";

type Props = {
  // Partner slug from lib/affiliates.ts.
  partner: string;
  className?: string;
  children: React.ReactNode;
  // Optional explicit disclosure tooltip on hover.
  showIcon?: boolean;
};

// Wraps an outbound link to a partner with the right rel attributes and
// routes through /go/<slug> so we control redirect + tracking centrally.
export function AffiliateLink({ partner, className = "", children, showIcon = true }: Props) {
  const p = findPartner(partner);
  if (!p) return <>{children}</>;
  const sponsored = isAffiliate(p);
  // rel=sponsored is the modern signal Google wants for affiliate links.
  // rel=nofollow is the fallback for non-affiliated outbound.
  const rel = sponsored ? "sponsored noopener noreferrer" : "nofollow noopener noreferrer";

  return (
    <a
      href={`/go/${p.slug}`}
      target="_blank"
      rel={rel}
      className={`inline-flex items-center gap-1 ${className}`}
      title={sponsored ? `Affiliate link to ${p.name}` : `External link to ${p.name}`}
    >
      {children}
      {showIcon && <ExternalLink className="h-3 w-3 opacity-60" />}
    </a>
  );
}
