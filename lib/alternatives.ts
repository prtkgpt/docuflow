// "Alternative to X" landing pages — bottom-of-funnel pages targeting people
// who already know a competitor and are searching for a cheaper / simpler
// option. Different from /compare which serves "best of" research intent.

export type AlternativePage = {
  slug: string;                          // url segment: /alternatives/<slug>
  competitor: string;                    // "DocuSign", "Smallpdf", etc.
  competitorUrl: string;                 // for the rel=nofollow outbound link
  category: string;                      // short tagline
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;                         // 2-3 sentence pitch
  // 4-6 reasons people switch — drives the body copy.
  switchReasons: { title: string; body: string }[];
  // Side-by-side comparison rows. Keep us in column 1, them in column 2.
  table: { feature: string; us: string; them: string }[];
  // Honest "when they're still better" section, builds trust.
  whenTheyAreBetter: string[];
  // Pricing comparison: 3-4 pricing tiers we summarize for the competitor.
  competitorPricingNote: string;         // "DocuSign Personal is $15/mo per user…"
  faq: { q: string; a: string }[];
  // Where the page CTA points (their main use case for our product).
  primaryCtaHref: string;
  primaryCtaLabel: string;
  // Tools to surface in "related" rail — pulled from lib/tools.ts.
  relatedToolSlugs: string[];
};

export const ALTERNATIVES: AlternativePage[] = [
  // -----------------------------------------------------------------------
  // DocuSign
  // -----------------------------------------------------------------------
  {
    slug: "docusign",
    competitor: "DocuSign",
    competitorUrl: "https://www.docusign.com",
    category: "e-signature",
    metaTitle: "DocuSign Alternative — MyPDFKitty (Free up to 10 envelopes/mo)",
    metaDescription:
      "Looking for a DocuSign alternative? MyPDFKitty lets you send PDFs for signature free up to 10 envelopes/month, with no per-user fees. Same audit trail, way cheaper.",
    h1: "The Affordable DocuSign Alternative",
    intro:
      "DocuSign is great if you're a Fortune 500 with a procurement department. For everyone else — freelancers, small teams, individuals signing the occasional NDA — you're paying $15+/user/month for a tiny fraction of what DocuSign does. MyPDFKitty gives you the core send-for-signature flow free up to 10 envelopes/month, with the same audit trail and no per-user pricing.",
    switchReasons: [
      {
        title: "Free for the first 10 envelopes every month",
        body: "DocuSign's cheapest plan is $15/month per user with a 5-document limit. MyPDFKitty's Free plan covers 10 send-for-signature envelopes per month with no credit card. If you outgrow it, Kitty Plus is $2.99/month — about one-fifth the price.",
      },
      {
        title: "No per-user fees",
        body: "DocuSign charges per sender. Add three teammates and you're at $45/month minimum. MyPDFKitty's Business plan includes 3 seats for $12.99/month total — and your recipients never need an account either way.",
      },
      {
        title: "Recipients sign without an account",
        body: "Same as DocuSign on this front — every signer gets a private link by email and signs in their browser. We just don't make you sign up to send.",
      },
      {
        title: "Audit trail is included, not gated",
        body: "Every signed PDF gets a certificate page with the envelope ID, every signer's name, email, view + sign timestamps, and IP address. It's appended automatically — no upgrade required.",
      },
      {
        title: "It's a full PDF toolkit, not just signatures",
        body: "DocuSign is e-signature. MyPDFKitty is e-signature plus 25+ tools: edit, compress, merge, split, OCR, translate, AI summary, chat with PDF. One subscription instead of stitching together three SaaS products.",
      },
      {
        title: "No software to install",
        body: "Browser-only. Works on a Chromebook, an iPad, your phone — anywhere with a tab.",
      },
    ],
    table: [
      { feature: "Free plan",                      us: "10 envelopes/mo, no credit card",         them: "Free trial only" },
      { feature: "Cheapest paid plan",             us: "$2.99/mo (Kitty Plus)",                   them: "$15/mo per user (Personal)" },
      { feature: "Per-user pricing",               us: "No — flat plan",                          them: "Yes" },
      { feature: "Recipients need an account",     us: "No",                                      them: "No" },
      { feature: "Audit certificate",              us: "Included on every signed PDF",            them: "Included" },
      { feature: "Multiple signers per envelope",  us: "Up to 10",                                them: "Yes" },
      { feature: "Reminders",                      us: "1-click manual reminder",                 them: "Manual + automatic" },
      { feature: "Other PDF tools",                us: "25+ tools (edit, OCR, AI, etc.)",          them: "Limited" },
      { feature: "AI summary / chat with PDF",     us: "Built-in",                                them: "Separate product" },
      { feature: "Storage",                        us: "Files isolated to your workspace",        them: "Cloud storage" },
    ],
    whenTheyAreBetter: [
      "You need eIDAS-qualified signatures or 21 CFR Part 11 compliance for regulated industries.",
      "You're routing 1,000+ envelopes per month with complex workflows (parallel + serial routing, conditional fields, multi-stage approvals).",
      "You require deep CRM integrations (Salesforce, Workday, SAP) that DocuSign has built over 20+ years.",
      "Your legal or procurement team has standardized on DocuSign and you can't switch.",
    ],
    competitorPricingNote:
      "DocuSign Personal is $15/month with a 5-document limit. Standard is $45/month per user. Business Pro is $65/month per user. (Verify current pricing on DocuSign's site.)",
    faq: [
      {
        q: "Is MyPDFKitty's send-for-signature legally binding like DocuSign?",
        a: "For everyday agreements (NDAs, contractor letters, offer letters, internal approvals) — yes. Both DocuSign and MyPDFKitty rely on the same legal framework: the U.S. ESIGN Act and EU eIDAS for standard electronic signatures. For workflows that require qualified e-signatures (eIDAS QES), notarization, or industry-specific compliance like 21 CFR Part 11, you'll still want DocuSign.",
      },
      {
        q: "Can I migrate my templates from DocuSign?",
        a: "Not directly — but your source PDFs are portable. Re-upload the document, drop signature/date/text fields where they belong, and save. We're working on template support for repeat-send envelopes.",
      },
      {
        q: "What happens to a signed PDF when I cancel?",
        a: "Completed envelopes stay in your dashboard with their signed PDFs and audit certificates intact. You can download them any time. Free plan signed PDFs are kept for 90 days; paid plans keep them indefinitely.",
      },
      {
        q: "How does MyPDFKitty stay this cheap?",
        a: "We don't have a sales team, an enterprise contract group, or a New York skyscraper. We're built for the long tail of users who don't need a 200-person legal review for every signature.",
      },
      {
        q: "Can I send to multiple signers at once?",
        a: "Yes — up to 10 recipients per envelope, each with their own fields (signature, initials, date, text, checkbox).",
      },
    ],
    primaryCtaHref: "/tools/send-for-signature",
    primaryCtaLabel: "Send your first envelope free",
    relatedToolSlugs: ["sign-pdf", "edit-pdf", "merge-pdf", "compress-pdf"],
  },

  // -----------------------------------------------------------------------
  // Smallpdf
  // -----------------------------------------------------------------------
  {
    slug: "smallpdf",
    competitor: "Smallpdf",
    competitorUrl: "https://smallpdf.com",
    category: "PDF toolkit",
    metaTitle: "Smallpdf Alternative — MyPDFKitty (Same Tools, $2.99/mo)",
    metaDescription:
      "Looking for a Smallpdf alternative? MyPDFKitty has the same PDF tools — compress, merge, split, sign, convert — at $2.99/month vs Smallpdf's $9+/month.",
    h1: "The Cheaper Smallpdf Alternative",
    intro:
      "Smallpdf has a clean UI and a familiar brand, but you'll hit a paywall fast and the Pro plan is around $9/month after the trial. MyPDFKitty does the same things — compress, merge, split, convert, sign — for $2.99/month, with a more generous free tier and no surprise upsells.",
    switchReasons: [
      {
        title: "One-third the price",
        body: "Smallpdf Pro is $9–$12/month. Kitty Plus is $2.99/month — same tools, fewer paywalls, no upsell modal every other click.",
      },
      {
        title: "Free tier you can actually use",
        body: "Smallpdf limits you to 2 file processings per day on free. We give you 5 files per day plus 10 send-for-signature envelopes per month, free.",
      },
      {
        title: "AI tools included",
        body: "Smallpdf charges extra for AI features. MyPDFKitty includes AI summary, Chat with PDF, and PDF translation in every paid plan.",
      },
      {
        title: "Send for signature free up to 10/month",
        body: "Smallpdf's eSign is paywalled. Ours is free up to 10 envelopes per month — including the audit trail.",
      },
      {
        title: "No watermark on free downloads (paid plans)",
        body: "Smallpdf adds a watermark to free outputs after the trial. Kitty Plus removes watermarks at $2.99/month — Smallpdf charges 3× that.",
      },
      {
        title: "Files stay private",
        body: "Both providers process files server-side. We isolate every upload to your account workspace and delete unsigned uploads automatically.",
      },
    ],
    table: [
      { feature: "Cheapest paid plan",           us: "$2.99/mo (Kitty Plus)",                   them: "~$9/mo (Pro)" },
      { feature: "Free plan limit",              us: "5 files/day",                             them: "2 tasks/day" },
      { feature: "Send for signature",           us: "Free up to 10/mo",                        them: "Paid only" },
      { feature: "AI PDF summary",               us: "Included on Pro",                         them: "Add-on" },
      { feature: "Chat with PDF",                us: "Included on Plus+",                       them: "Limited / extra" },
      { feature: "OCR PDF",                      us: "Included on Pro",                         them: "Pro only" },
      { feature: "PDF translation (25+ langs)",  us: "Free 2/mo · 20+ on paid",                 them: "Not native" },
      { feature: "Max upload (paid)",            us: "100 MB Plus / 250 MB Pro",                them: "5 GB Pro" },
      { feature: "Watermark on free",            us: "Sometimes",                               them: "After trial" },
      { feature: "Mobile apps",                  us: "Browser only (works on mobile)",          them: "iOS + Android apps" },
    ],
    whenTheyAreBetter: [
      "You routinely process huge PDFs (>250 MB) — Smallpdf's Pro plan supports up to 5 GB uploads.",
      "You prefer a dedicated mobile app (iOS / Android) over a mobile browser experience.",
      "You're already deep in Smallpdf's Dropbox / Google Drive integrations and switching would break a workflow.",
    ],
    competitorPricingNote:
      "Smallpdf Pro is around $9/month billed annually, $12/month billed monthly. Team and Business plans add per-user fees. (Verify current pricing on Smallpdf's site.)",
    faq: [
      {
        q: "Does MyPDFKitty have all the same tools as Smallpdf?",
        a: "All the popular ones — compress, merge, split, rotate, delete pages, edit, sign, PDF↔Word, PDF↔Excel, PDF↔JPG/PNG, OCR, password protect. Plus AI tools (summary, chat, translate) that Smallpdf charges extra for or doesn't have natively.",
      },
      {
        q: "What about file size limits?",
        a: "Free: 25 MB. Plus: 100 MB. Pro: 250 MB. Business: 500 MB. Smallpdf Pro goes up to 5 GB, so for huge PDFs they're still the better fit.",
      },
      {
        q: "Can I import from Google Drive or Dropbox?",
        a: "Drag-and-drop or file picker for now. Cloud storage integrations are on the roadmap.",
      },
      {
        q: "How does the watermark work?",
        a: "Free plan outputs may include a small MyPDFKitty watermark on conversions. Any paid plan ($2.99+/month) removes it.",
      },
      {
        q: "Will my files be deleted?",
        a: "Source uploads are auto-deleted after processing on free plans. Paid plans keep your file history in your private workspace until you delete it.",
      },
    ],
    primaryCtaHref: "/tools",
    primaryCtaLabel: "Try MyPDFKitty free",
    relatedToolSlugs: ["compress-pdf", "merge-pdf", "pdf-to-word", "sign-pdf"],
  },

  // -----------------------------------------------------------------------
  // iLovePDF
  // -----------------------------------------------------------------------
  {
    slug: "ilovepdf",
    competitor: "iLovePDF",
    competitorUrl: "https://www.ilovepdf.com",
    category: "PDF toolkit",
    metaTitle: "iLovePDF Alternative — MyPDFKitty (No Ads, AI Included)",
    metaDescription:
      "Looking for an iLovePDF alternative without the ads and upsell popups? MyPDFKitty gives you the same PDF tools plus AI summary, chat, and translate — from $2.99/mo.",
    h1: "The Ad-Free iLovePDF Alternative",
    intro:
      "iLovePDF has a wide tool catalog and a free tier, but the free experience is heavy on ads and the Premium plan starts at around $7/month. MyPDFKitty gives you the same tools at $2.99/month, no ads, and adds AI features (summary, chat, translate) that iLovePDF doesn't have natively.",
    switchReasons: [
      {
        title: "No ads, no popup upsells",
        body: "We don't run third-party ads. Your free PDF processing isn't interrupted by display banners or modal upsells every other click.",
      },
      {
        title: "Cheaper paid plan",
        body: "iLovePDF Premium starts at around $7/month billed annually. Kitty Plus is $2.99/month — less than half.",
      },
      {
        title: "AI features built in",
        body: "iLovePDF doesn't have a native AI summarizer or PDF chat. We include both starting on the $2.99/month Plus plan.",
      },
      {
        title: "Send for signature free up to 10/month",
        body: "iLovePDF's eSign is a separate paid product. Ours is built in and free up to 10 envelopes per month with audit certificate included.",
      },
      {
        title: "Multi-language OCR (25 languages)",
        body: "Both providers offer OCR. We support 25 trained-data languages including Arabic, Hindi, Chinese, Japanese, and Korean — and produce searchable PDFs in your browser.",
      },
      {
        title: "Translate PDFs to and from 25+ languages",
        body: "Drop a PDF, pick source and target languages, get translated text back. Not a feature iLovePDF has natively.",
      },
    ],
    table: [
      { feature: "Cheapest paid plan",       us: "$2.99/mo (Kitty Plus)",                  them: "~$7/mo (Premium)" },
      { feature: "Ads on free tier",         us: "None",                                   them: "Display ads" },
      { feature: "AI summary",               us: "Included on Pro",                        them: "Not native" },
      { feature: "Chat with PDF",            us: "Included on Plus+",                      them: "Not native" },
      { feature: "PDF translation",          us: "25+ languages, 2 free/mo",               them: "Not native" },
      { feature: "OCR PDF",                  us: "25 languages, included on Pro",          them: "Premium only" },
      { feature: "Send for signature",       us: "Free 10/mo · 50 on Plus",                them: "Separate paid product" },
      { feature: "Max upload (paid)",        us: "100–500 MB",                             them: "200 MB+" },
      { feature: "API access",               us: "Roadmap",                                them: "Yes" },
      { feature: "Desktop & mobile apps",    us: "Browser only",                           them: "Yes" },
    ],
    whenTheyAreBetter: [
      "You need API access today — iLovePDF has a mature REST API; ours is on the roadmap.",
      "You want desktop or mobile native apps rather than a browser experience.",
      "You process truly massive PDFs (>500 MB) regularly.",
    ],
    competitorPricingNote:
      "iLovePDF Premium is around $7/month billed annually or $9/month billed monthly. Business plans add per-user fees. (Verify current pricing on iLovePDF's site.)",
    faq: [
      {
        q: "Is MyPDFKitty actually faster?",
        a: "For most jobs, yes — fewer redirects, no ad scripts loading on free pages, and PDFs process server-side in seconds. Network speed matters more than the provider for sub-100-MB files.",
      },
      {
        q: "Do you have all 30 of iLovePDF's tools?",
        a: "Not yet — we ship the most-used 25+ (compress, merge, split, edit, sign, send-for-signature, PDF↔Word/Excel/PPT/JPG/PNG, OCR, translate, AI summary, chat, organize, page management, watermark removal). The rare-use tools are on our roadmap.",
      },
      {
        q: "Can I batch-process files?",
        a: "Pro and Business plans include batch processing. Free and Plus are single-file at a time.",
      },
      {
        q: "Will I see ads on the free plan?",
        a: "No third-party ads anywhere. Sometimes a small in-product upsell to upgrade — never a banner network or autoplaying video.",
      },
      {
        q: "How does pricing scale for teams?",
        a: "Business is $12.99/month for 3 seats with $3/month per additional seat. iLovePDF Business has higher per-user fees that add up fast.",
      },
    ],
    primaryCtaHref: "/tools",
    primaryCtaLabel: "Try MyPDFKitty free",
    relatedToolSlugs: ["compress-pdf", "merge-pdf", "ocr-pdf", "translate-pdf"],
  },

  // -----------------------------------------------------------------------
  // Adobe Acrobat
  // -----------------------------------------------------------------------
  {
    slug: "adobe-acrobat",
    competitor: "Adobe Acrobat",
    competitorUrl: "https://www.adobe.com/acrobat.html",
    category: "PDF editor",
    metaTitle: "Adobe Acrobat Alternative — MyPDFKitty ($2.99/mo, No Install)",
    metaDescription:
      "Adobe Acrobat alternative for everyday PDF editing — sign, compress, merge, convert, and AI summarize PDFs in your browser. From $2.99/month vs Adobe's $14.99/month.",
    h1: "The Affordable Adobe Acrobat Alternative",
    intro:
      "Adobe Acrobat is the gold standard if you're editing PDFs all day, every day, inside the Creative Cloud workflow. For everyone else — students, freelancers, small businesses, anyone signing the occasional contract or compressing the occasional file — paying $14.99/month for software you'll use twice a week is overkill. MyPDFKitty does the daily PDF work in your browser for $2.99/month.",
    switchReasons: [
      {
        title: "5× cheaper",
        body: "Acrobat Standard is $14.99/month. Acrobat Pro is $19.99/month. Kitty Plus is $2.99/month with the tools 95% of users actually need.",
      },
      {
        title: "Nothing to install",
        body: "Adobe wants you to install Acrobat Reader DC and update it monthly. MyPDFKitty runs in any browser — Chromebook, iPad, library computer, your phone.",
      },
      {
        title: "AI tools that don't cost extra",
        body: "Adobe charges extra for AI Assistant ($4.99/month add-on). MyPDFKitty includes AI summary, Chat with PDF, and PDF translation in our regular plans.",
      },
      {
        title: "Send for signature without buying Acrobat Sign",
        body: "Adobe Sign is a separate product starting at $14.99/user/month. Our send-for-signature is free up to 10 envelopes/month and built into the same toolkit.",
      },
      {
        title: "Free tier covers everyday use",
        body: "Acrobat's free Reader can view but not edit. MyPDFKitty's free plan does 5 files/day of real editing — compress, merge, split, sign, send-for-signature, basic AI.",
      },
      {
        title: "No Creative Cloud account required",
        body: "Sign in once with email or Google. We don't sell your data to other Adobe products.",
      },
    ],
    table: [
      { feature: "Cheapest paid plan",       us: "$2.99/mo (Kitty Plus)",                  them: "$14.99/mo (Standard)" },
      { feature: "Free plan",                us: "5 files/day, real editing",              them: "Reader only — view, no edit" },
      { feature: "Install required",         us: "No — browser only",                      them: "Acrobat desktop install" },
      { feature: "Send for signature",       us: "Free 10/mo · 50 on Plus",                them: "Acrobat Sign — separate $14.99/user" },
      { feature: "AI tools",                 us: "Included on Plus+ ($2.99)",              them: "Add-on $4.99/mo on top of Pro" },
      { feature: "OCR PDF",                  us: "25 languages, included on Pro",          them: "Acrobat Pro only" },
      { feature: "Edit text in PDF",         us: "Annotations + signing today",             them: "Full text editing" },
      { feature: "Forms (fillable)",         us: "Roadmap",                                them: "Full forms designer" },
      { feature: "Print production tools",   us: "No",                                     them: "Yes" },
      { feature: "Mobile apps",              us: "Browser (works on phones)",              them: "iOS + Android" },
    ],
    whenTheyAreBetter: [
      "You're editing PDF source text routinely — Acrobat's text editor remains best in class.",
      "You're building complex fillable forms with calculations and conditional logic.",
      "You're in print production and need preflight, color management, or PDF/X output.",
      "You're on Creative Cloud already — Acrobat is bundled and switching makes no sense.",
      "You need accessibility tagging audits for ADA / WCAG compliance.",
    ],
    competitorPricingNote:
      "Acrobat Standard is $14.99/month. Acrobat Pro is $19.99/month. Acrobat Sign starts at $14.99/user/month for sending. AI Assistant is $4.99/month on top. (Verify current pricing on Adobe's site.)",
    faq: [
      {
        q: "Can MyPDFKitty edit PDF text the way Acrobat does?",
        a: "Today: annotations, signatures, highlights, image insertion, and full page management — but not direct edits to existing text inside the PDF. That's on the roadmap. For occasional text fixes, run our PDF-to-Word converter, edit in Word, and convert back.",
      },
      {
        q: "Are MyPDFKitty signatures legally equivalent to Acrobat Sign?",
        a: "For standard electronic signatures under the U.S. ESIGN Act and EU eIDAS — yes, both meet the same legal bar. For qualified e-signatures (eIDAS QES) or industry-specific compliance like 21 CFR Part 11, Adobe Sign and DocuSign have specialized offerings.",
      },
      {
        q: "Will my Acrobat-created PDFs work on MyPDFKitty?",
        a: "Yes — every PDF is just a PDF. Upload it and use whichever tool you need.",
      },
      {
        q: "Do you support PDF/A or PDF/X archival formats?",
        a: "Output is standard PDF. PDF/A and PDF/X support is on the roadmap for the Business plan.",
      },
      {
        q: "What happens to my files?",
        a: "Files are isolated to your account workspace, encrypted at rest, and only readable by you. Free plan uploads are auto-deleted after processing; paid plans keep them until you delete.",
      },
    ],
    primaryCtaHref: "/tools/edit-pdf",
    primaryCtaLabel: "Edit your first PDF free",
    relatedToolSlugs: ["edit-pdf", "sign-pdf", "compress-pdf", "ocr-pdf"],
  },

  // -----------------------------------------------------------------------
  // PDFfiller
  // -----------------------------------------------------------------------
  {
    slug: "pdffiller",
    competitor: "PDFfiller",
    competitorUrl: "https://www.pdffiller.com",
    category: "form filling + e-sign",
    metaTitle: "PDFfiller Alternative — MyPDFKitty (Free 10 Signatures/mo)",
    metaDescription:
      "PDFfiller alternative for filling, signing, and sending PDFs. MyPDFKitty is $2.99/month vs PDFfiller's $20+/month, with 10 free signature envelopes monthly.",
    h1: "The Cheaper PDFfiller Alternative",
    intro:
      "PDFfiller is built around fill-and-sign forms, but the price has crept up to $20–$60/month per user depending on the plan. MyPDFKitty does the same fill-and-sign work plus 25+ other PDF tools for $2.99/month — and the first 10 signature envelopes every month are free.",
    switchReasons: [
      {
        title: "10× cheaper at the entry tier",
        body: "PDFfiller Basic starts around $20/month. Kitty Plus is $2.99/month. The math is brutal if you don't need PDFfiller's enterprise feature set.",
      },
      {
        title: "Send for signature free up to 10/month",
        body: "PDFfiller paywalls signatures at all tiers. We give you 10 envelopes per month free with the full audit trail, no credit card.",
      },
      {
        title: "More than just forms",
        body: "PDFfiller's value is the form-filling UX. We have that plus compress, merge, split, OCR, AI summary, chat with PDF, translate — one subscription replaces three.",
      },
      {
        title: "Recipients sign without an account",
        body: "Both products send a private link by email. Neither requires recipients to create an account.",
      },
      {
        title: "Audit trail is automatic",
        body: "Every signed PDF gets a certificate page with signer name, email, IP, and timestamps appended. No upgrade required.",
      },
      {
        title: "Browser-only — no install",
        body: "PDFfiller pushes a desktop app and Chrome extension. We're 100% browser-based.",
      },
    ],
    table: [
      { feature: "Cheapest paid plan",         us: "$2.99/mo (Kitty Plus)",                  them: "~$20/mo (Basic)" },
      { feature: "Free plan",                  us: "5 files/day + 10 envelopes/mo",          them: "30-day trial only" },
      { feature: "Send for signature",         us: "Free 10/mo · 50 on Plus",                them: "Paid only" },
      { feature: "Audit certificate",          us: "Included",                               them: "Premium plans" },
      { feature: "AI features",                us: "Summary + Chat + Translate",             them: "Limited" },
      { feature: "OCR PDF",                    us: "25 languages, Pro plan",                 them: "Premium plans" },
      { feature: "Form templates",             us: "Coming soon",                            them: "Large library" },
      { feature: "Recipients need account",    us: "No",                                     them: "No" },
      { feature: "API",                        us: "Roadmap",                                them: "Available on Premium" },
      { feature: "Mobile app",                 us: "Browser (mobile-friendly)",              them: "iOS + Android" },
    ],
    whenTheyAreBetter: [
      "You need PDFfiller's library of pre-built IRS / tax / government form templates.",
      "You're routing complex multi-stage approval workflows with conditional fields.",
      "You require notarization or 21 CFR Part 11 compliance bundled into the signing flow.",
      "You're already on a PDFfiller team plan with tens of users and switching cost is high.",
    ],
    competitorPricingNote:
      "PDFfiller Basic is around $20/month. Plus is around $30/month. Premium is around $60/month per user. (Verify current pricing on PDFfiller's site.)",
    faq: [
      {
        q: "Can I fill out a PDF form in MyPDFKitty?",
        a: "Yes — open the PDF in our editor and add text fields, checkboxes, and signature fields anywhere on the document. For PDFs with native form fields, we read and let you fill them directly.",
      },
      {
        q: "Do you have a library of ready-made forms?",
        a: "Not yet — that's PDFfiller's biggest value-add and we're building it. For now, upload your form PDF (W-9, lease, etc.) and fill it out in our editor.",
      },
      {
        q: "Are signatures legally binding?",
        a: "For standard electronic signatures under U.S. ESIGN and EU eIDAS — yes. For notarized or qualified signatures, use a service that specializes in that.",
      },
      {
        q: "Can I send a filled form to someone else for review or signing?",
        a: "Yes — that's exactly what our send-for-signature feature does. Drop signature/date/text fields on any page, assign each to a recipient, and send.",
      },
      {
        q: "Does my signed PDF have an audit trail?",
        a: "Yes. The final signed PDF includes a certificate page with the envelope ID, every signer's name + email, view + sign timestamps, and IP addresses. Identical to what PDFfiller's audit trail records.",
      },
    ],
    primaryCtaHref: "/tools/send-for-signature",
    primaryCtaLabel: "Try send-for-signature free",
    relatedToolSlugs: ["sign-pdf", "edit-pdf", "merge-pdf", "ocr-pdf"],
  },
];

export function findAlternative(slug: string): AlternativePage | undefined {
  return ALTERNATIVES.find((a) => a.slug === slug);
}
