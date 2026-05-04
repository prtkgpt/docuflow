// Affiliate partner registry.
//
// Each partner has an official URL (always set, used as fallback) and an
// optional affiliateUrl (set once you've been approved into their program).
// Until affiliateUrl is set, /go/<slug> redirects to the plain official URL
// with rel=nofollow — so we don't lose link equity to a non-paying outbound.
//
// To enable an affiliate link, sign up for the partner's program (links and
// network noted in `programNote`), get your affiliate URL or tracking link,
// and replace `affiliateUrl: null` with the real URL.

export type Partner = {
  slug: string;
  name: string;
  // Official website (used as fallback and for the on-page label).
  officialUrl: string;
  // Affiliate-tracked URL. Set this after approval.
  affiliateUrl: string | null;
  // Where you sign up + a 1-line note on commission terms (verify before counting on).
  programNote: string;
  // Short blurb shown in any "we recommend" placements.
  blurb: string;
  // Optional: which competitor pages this partner is relevant on.
  relevantOn?: string[];
};

export const PARTNERS: Partner[] = [
  {
    slug: "adobe-acrobat",
    name: "Adobe Acrobat",
    officialUrl: "https://www.adobe.com/acrobat.html",
    affiliateUrl: null,
    programNote:
      "Sign up via partners.adobe.com (managed by Partnerize / Tradedoubler depending on region). Commissions on Creative Cloud + Acrobat signups. Verify current rate.",
    blurb:
      "The industry-standard PDF editor. Best fit if you live inside Creative Cloud and need full text editing or print-production tools.",
    relevantOn: ["adobe-acrobat", "smallpdf", "ilovepdf"],
  },
  {
    slug: "docusign",
    name: "DocuSign",
    officialUrl: "https://www.docusign.com",
    affiliateUrl: null,
    programNote:
      "Apply via Impact (impact.com → search 'DocuSign'). Historically ~30% commission on first-year subscription. Verify current terms.",
    blurb:
      "Enterprise-grade e-signature with eIDAS QES support, deep CRM integrations, and the most-recognized brand for high-stakes signing.",
    relevantOn: ["docusign", "pdffiller"],
  },
  {
    slug: "pandadoc",
    name: "PandaDoc",
    officialUrl: "https://www.pandadoc.com",
    affiliateUrl: null,
    programNote:
      "Apply via PartnerStack (partnerstack.com → search 'PandaDoc'). Commissions on paid subscription signups. Verify current rate.",
    blurb:
      "Document automation + e-signature aimed at sales teams — proposal templates, CRM sync, payment collection on signed docs.",
    relevantOn: ["docusign", "pdffiller"],
  },
  {
    slug: "dropbox",
    name: "Dropbox",
    officialUrl: "https://www.dropbox.com",
    affiliateUrl: null,
    programNote:
      "Apply via Impact (impact.com → search 'Dropbox'). Historically ~$25 per Plus signup. Verify current terms.",
    blurb:
      "Cloud storage + document sharing. Useful when an attachment is over 25 MB and you need a share link instead.",
    relevantOn: ["smallpdf", "ilovepdf"],
  },
  {
    slug: "notion",
    name: "Notion",
    officialUrl: "https://www.notion.so",
    affiliateUrl: null,
    programNote:
      "Apply at notion.com → Affiliate Program. Historically 50% recurring commission for the first 12 months on referred paid plans. Verify current terms.",
    blurb:
      "All-in-one workspace for docs, wikis, and project tracking. Many MyPDFKitty users use Notion alongside it for project documentation.",
  },
  {
    slug: "grammarly",
    name: "Grammarly",
    officialUrl: "https://www.grammarly.com",
    affiliateUrl: null,
    programNote:
      "Apply via CJ Affiliate (cj.com → search 'Grammarly'). Historically ~$20 per Premium signup. Verify current terms.",
    blurb:
      "Writing assistant for documents and emails. Pairs well with PDF tools when you're polishing a contract, resume, or report.",
  },
  {
    slug: "calendly",
    name: "Calendly",
    officialUrl: "https://www.calendly.com",
    affiliateUrl: null,
    programNote:
      "Apply via Impact (impact.com → search 'Calendly'). Per-paid-signup bounty. Verify current terms.",
    blurb:
      "Scheduling tool — useful for the workflow around signed contracts (book the kickoff meeting after the contract closes).",
  },

  // Stubs for the remaining alternative-page competitors. No active affiliate
  // program until the user fills in affiliateUrl, but registering them here
  // means /go/<slug> works and we get a unified outbound-tracking story.
  {
    slug: "smallpdf",
    name: "Smallpdf",
    officialUrl: "https://smallpdf.com",
    affiliateUrl: null,
    programNote:
      "Smallpdf has historically run an affiliate program via Tapfiliate. Check smallpdf.com/affiliate or contact partnerships@smallpdf.com.",
    blurb: "Browser-based PDF toolkit with a familiar UI. Best fit for users who need 5 GB upload caps.",
    relevantOn: ["smallpdf"],
  },
  {
    slug: "ilovepdf",
    name: "iLovePDF",
    officialUrl: "https://www.ilovepdf.com",
    affiliateUrl: null,
    programNote:
      "iLovePDF's affiliate program has been available via Tapfiliate. Check ilovepdf.com/affiliates or contact their support.",
    blurb: "Wide PDF tool catalog with mobile + desktop apps. Best fit if you want a native mobile experience.",
    relevantOn: ["ilovepdf"],
  },
  {
    slug: "pdffiller",
    name: "PDFfiller",
    officialUrl: "https://www.pdffiller.com",
    affiliateUrl: null,
    programNote:
      "PDFfiller (airSlate) runs an affiliate program via Impact. Search 'pdfFiller' on impact.com.",
    blurb: "Form-filling and e-signature platform with a deep template library for IRS / government forms.",
    relevantOn: ["pdffiller"],
  },
];

export function findPartner(slug: string): Partner | undefined {
  return PARTNERS.find((p) => p.slug === slug);
}

// Pick the right outbound URL for a partner. Falls back to the official URL
// (with nofollow) if no affiliate link is set yet.
export function partnerOutboundUrl(partner: Partner): string {
  return partner.affiliateUrl ?? partner.officialUrl;
}

export function isAffiliate(partner: Partner): boolean {
  return Boolean(partner.affiliateUrl);
}
