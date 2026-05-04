import { NextRequest, NextResponse } from "next/server";
import { findPartner, partnerOutboundUrl } from "@/lib/affiliates";

export const runtime = "nodejs";

// Internal redirect for affiliate / outbound partner links.
// Centralizing means we can swap targets, add tracking params, or pause
// a partner without editing every link across the site.
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const partner = findPartner(params.slug);
  if (!partner) {
    return NextResponse.redirect(new URL("/", req.url), 302);
  }
  const target = new URL(partnerOutboundUrl(partner));

  // Server-side log so the click appears in Vercel logs even when the user
  // immediately closes the tab. Cheap analytics that survives ad blockers.
  console.log("[outbound]", {
    partner: partner.slug,
    affiliate: Boolean(partner.affiliateUrl),
    referer: req.headers.get("referer") || null,
    ua: (req.headers.get("user-agent") || "").slice(0, 120),
  });

  return NextResponse.redirect(target, 302);
}
