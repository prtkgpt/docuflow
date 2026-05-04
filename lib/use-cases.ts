// Programmatic landing pages — tool × use-case combinations.
// Each entry must have unique copy: scenario-specific intro, real numbers,
// tailored FAQ. Generic templated content gets penalized; specific content
// ranks. We hand-author each entry rather than auto-generating.

export type UseCase = {
  slug: string;                  // e.g. "compress-pdf-for-email"
  parentToolSlug: string;        // matches lib/tools.ts slug
  parentToolHref: string;        // where the CTA upload button sends them
  category: string;              // short tag shown on hub page
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;                 // 3-5 sentence unique intro
  // Specific facts/numbers about the scenario — drives uniqueness signal.
  whatToKnow: { title: string; body: string }[];
  steps: { name: string; text: string }[];
  tips: string[];
  faq: { q: string; a: string }[];
  // Other use-case slugs to surface as "related scenarios".
  related: string[];
  ctaLabel: string;
};

export const USE_CASES: UseCase[] = [
  // -----------------------------------------------------------------------
  // Compress PDF — 3 use cases
  // -----------------------------------------------------------------------
  {
    slug: "compress-pdf-for-email",
    parentToolSlug: "compress-pdf",
    parentToolHref: "/tools/compress-pdf",
    category: "Compress PDF",
    h1: "Compress PDF for Email — Fit Under Gmail's 25 MB Limit",
    metaTitle: "Compress PDF for Email Free | Fit Under 25 MB | MyPDFKitty",
    metaDescription:
      "Compress PDF files to fit email attachment limits. Gmail allows 25 MB, Outlook 20 MB, Yahoo 25 MB. Free in your browser, no install.",
    intro:
      "Email attachment limits are the #1 reason PDFs get bounced. Gmail caps attachments at 25 MB, Outlook.com at 20 MB, Yahoo Mail at 25 MB, and most corporate Exchange servers cap at 10 MB or less. If your PDF is over the limit, you have two choices: compress it or upload it to a cloud share. Compressing is faster, keeps the email self-contained, and usually preserves enough quality for everyday documents.",
    whatToKnow: [
      {
        title: "Real attachment limits by provider (2026)",
        body: "Gmail: 25 MB · Outlook.com / Microsoft 365: 20 MB (Outlook web sometimes 33 MB total mailbox) · Yahoo Mail: 25 MB · iCloud Mail: 20 MB · ProtonMail Free: 25 MB · Most enterprise Exchange: 10–20 MB depending on admin policy.",
      },
      {
        title: "Most email-bounced PDFs shrink 50–80%",
        body: "Image-heavy PDFs (scanned documents, design proofs, slide decks exported as PDF) are the easiest to compress. A 60 MB scan often drops to 8–12 MB without visible quality loss. Text-only PDFs are usually already small and compress less.",
      },
      {
        title: "The 'attachment is over 25 MB' bounce",
        body: "Gmail measures the encoded attachment size, which is roughly 33% larger than the file on disk because of base64 encoding. So a 19 MB file on disk becomes ~25 MB in transit and may get bounced. Aim for 18 MB or smaller on disk to be safe with Gmail.",
      },
      {
        title: "Compression vs. quality trade-off",
        body: "Our default compression preserves text crispness and downsamples photos to 150 DPI — enough for screen viewing and standard printing. For print-grade documents, save the original or run a less aggressive compression pass.",
      },
    ],
    steps: [
      { name: "Upload your PDF", text: "Drop the file you need to email, or click to upload." },
      { name: "Compress", text: "MyPDFKitty automatically picks compression settings tuned for email — readable at screen size, fits under common attachment limits." },
      { name: "Check the size", text: "We show the before/after size. If it's still too big for your provider, run it again or split the PDF into pages first." },
      { name: "Download and attach", text: "Download the compressed PDF and attach it to your email. Done." },
    ],
    tips: [
      "If you're sending a contract for signing, send the link instead of the file — try our send-for-signature tool (10 free/month).",
      "If your PDF is a scan, run OCR first so the recipient can search the text. OCR doesn't increase file size meaningfully.",
      "For corporate Exchange (often 10 MB cap), split the PDF and send in two emails or use a cloud share link.",
      "Dropbox / Google Drive / WeTransfer are good fallbacks if compression isn't enough — but a compressed direct attachment is faster for the recipient.",
    ],
    faq: [
      {
        q: "What's the maximum email attachment size for Gmail?",
        a: "25 MB on disk, but base64 encoding inflates that ~33% in transit, so files over ~18 MB on disk can hit the limit. Compress to 18 MB or smaller to be safe.",
      },
      {
        q: "How do I send a PDF that's larger than 25 MB?",
        a: "Either compress it (this tool) or upload to Google Drive / Dropbox / OneDrive and send the share link. Gmail prompts you to use Drive automatically when an attachment is too big.",
      },
      {
        q: "Will compression hurt the quality of my PDF?",
        a: "For text-based PDFs, no — text stays crisp. For image-heavy PDFs, photos are downsampled to 150 DPI which is fine for screen viewing and standard printing. Save the original if you need a print-grade copy.",
      },
      {
        q: "Why is my PDF still too big after compression?",
        a: "Some PDFs are already optimized — try splitting into smaller chunks instead. Or convert to JPG/PNG with our PDF-to-JPG tool, then re-merge only the pages you need.",
      },
      {
        q: "Is it safe to compress confidential PDFs online?",
        a: "Files are isolated to your private workspace, encrypted in transit and at rest, and auto-deleted on the free plan after processing. We never share or train on your files.",
      },
    ],
    related: ["compress-pdf-for-upload", "reduce-pdf-size-without-losing-quality", "merge-pdf-for-resume"],
    ctaLabel: "Compress your PDF for email",
  },
  {
    slug: "compress-pdf-for-upload",
    parentToolSlug: "compress-pdf",
    parentToolHref: "/tools/compress-pdf",
    category: "Compress PDF",
    h1: "Compress PDF for Upload — USCIS, Job Portals, Visa Forms",
    metaTitle: "Compress PDF for Upload Free | USCIS, Visa, Job Portal | MyPDFKitty",
    metaDescription:
      "Compress PDFs to fit government and job portal upload limits. USCIS caps at 6 MB, most job portals at 5 MB. Free in your browser.",
    intro:
      "Government forms and job portals are notorious for tight upload limits — often half what email allows. USCIS caps document uploads at 6 MB. Most ATS (applicant tracking systems) cap resumes at 5 MB. Visa application portals frequently cap at 2 MB per document. If your PDF exceeds the cap, the form rejects the upload silently or with a useless error like 'file format not supported.' This page is for getting under those caps fast.",
    whatToKnow: [
      {
        title: "Common upload caps by destination",
        body: "USCIS / myUSCIS: 6 MB per file · Most U.S. job ATS portals (Workday, Greenhouse, Lever): 5 MB resume, 5 MB cover letter · Indian visa portals (BLS, VFS): often 1–2 MB · UK Visas & Immigration: 6 MB · LinkedIn Easy Apply: 5 MB · Common Application: 500 KB.",
      },
      {
        title: "USCIS document specs",
        body: "USCIS requires PDFs (not images), under 6 MB, color or black-and-white. They reject password-protected PDFs and forms that include attached files. We also recommend OCR if you're submitting scans — it makes the document searchable and accepted faster.",
      },
      {
        title: "ATS-friendly compression",
        body: "Job application systems parse text from PDFs to populate fields. Aggressive compression can rasterize text into images, which breaks ATS parsing. Our default keeps text as text — the resume still ranks correctly in keyword screens.",
      },
      {
        title: "Visa portal caps are tighter than you think",
        body: "Many visa application portals (especially BLS, VFS, and country-specific portals) cap at 2 MB per document and reject anything over. They also often require resolution under 300 DPI and may require black-and-white. Compress aggressively and convert color to grayscale if needed.",
      },
    ],
    steps: [
      { name: "Upload your PDF", text: "Pick the form or document you're submitting." },
      { name: "Compress", text: "Default compression brings most documents under 5 MB. For 2 MB visa caps, run compression twice or split the PDF first." },
      { name: "Verify size before upload", text: "Check the file is under your portal's cap. We show the new size in MB next to the download button." },
      { name: "Upload to the portal", text: "Most portals accept the compressed PDF directly. If it still fails, the issue is usually password-protection or wrong file format." },
    ],
    tips: [
      "Remove password protection before uploading — most government portals reject password-protected PDFs.",
      "Run OCR on scanned documents before submitting to USCIS or visa portals — they process text-readable PDFs faster.",
      "For visa portals with 2 MB caps, also reduce color depth: scan or save in black-and-white if the form allows.",
      "If your portal requires a specific filename format (e.g., 'I-130_Smith_John.pdf'), rename after compressing.",
    ],
    faq: [
      {
        q: "What is the USCIS file size limit?",
        a: "6 MB per document for most uploads via myUSCIS. Form-specific limits may apply — always check the form's upload page.",
      },
      {
        q: "Why does my PDF upload keep failing?",
        a: "Common causes: file too large (most common), password-protected, wrong format (must be PDF not Word), or contains attached files. Compress, remove password, and re-save.",
      },
      {
        q: "Will compression break my resume's ATS parsing?",
        a: "Not with our default compression — text stays as text and is still searchable. Avoid 'image-only' compression for resumes.",
      },
      {
        q: "How do I get under a 2 MB visa portal limit?",
        a: "Compress twice if needed, convert color images to grayscale, and remove unnecessary pages. If it's a scan, lower the scan resolution to 200 DPI before compressing.",
      },
      {
        q: "Can I batch-compress multiple PDFs at once?",
        a: "Pro and Business plans include batch processing. Free and Plus plans process one file at a time.",
      },
    ],
    related: ["compress-pdf-for-email", "reduce-pdf-size-without-losing-quality", "pdf-to-word-without-losing-formatting"],
    ctaLabel: "Compress your PDF for upload",
  },
  {
    slug: "reduce-pdf-size-without-losing-quality",
    parentToolSlug: "compress-pdf",
    parentToolHref: "/tools/compress-pdf",
    category: "Compress PDF",
    h1: "Reduce PDF Size Without Losing Quality",
    metaTitle: "Reduce PDF Size Without Losing Quality | Free Online | MyPDFKitty",
    metaDescription:
      "Shrink PDF files without visibly losing quality. Default compression preserves text crispness and downsamples images sensibly. Free, in your browser.",
    intro:
      "There's an art to PDF compression: shrink as much as possible without making text fuzzy or photos pixelated. Aggressive 'compress everything' tools strip too much and produce visually compromised files. Sensible compression — what we do by default — preserves text rendering, downsamples photos to 150 DPI (fine for screen and standard printing), and strips embedded fonts and metadata that don't change how the PDF looks.",
    whatToKnow: [
      {
        title: "What gets removed safely",
        body: "Embedded font subsets that aren't actually used, document metadata you don't need (author, comments history), thumbnail previews PDF readers regenerate anyway, duplicate XObjects, and unnecessary color profiles. None of these change how the PDF looks.",
      },
      {
        title: "What we downsample (and what we don't)",
        body: "Photos and images: from whatever they are down to 150 DPI (standard screen + print). Text: never touched, stays vector-crisp. Vector graphics (logos, line art): never rasterized, stay sharp at any zoom.",
      },
      {
        title: "Realistic size reductions",
        body: "Image-heavy reports / presentations / scanned documents: 50–80% smaller. Mixed text-and-image documents: 20–40% smaller. Pure text PDFs (e.g., a Word doc exported as PDF): often already optimized — only 5–15% reduction is possible.",
      },
      {
        title: "When you need print-grade",
        body: "If you're sending the PDF to a commercial printer, skip compression. Send the original. Compressed PDFs at 150 DPI look fine on screen and home printers but show banding or softness on offset / high-DPI digital printing.",
      },
    ],
    steps: [
      { name: "Upload your PDF", text: "Drop the original — we never touch your source file." },
      { name: "Compress", text: "Default settings preserve quality. We show before/after sizes." },
      { name: "Compare visually", text: "Open both versions side by side. If the compressed one looks acceptable, you're done." },
      { name: "Download", text: "Save the compressed PDF. Original stays in your workspace if you need it back." },
    ],
    tips: [
      "If text looks fuzzy after compression, that PDF probably had its text stored as images already (a scan). Run OCR first to turn it back into real text.",
      "If photos look grainy, the original was probably already low-resolution — compression didn't cause it.",
      "Always keep the original. 'Compressed forever' means you can't undo if you need the high-quality version later.",
    ],
    faq: [
      {
        q: "What's the difference between 'lossy' and 'lossless' PDF compression?",
        a: "Lossless removes redundancy (duplicate fonts, metadata, XObjects) without changing how the PDF looks. Lossy downsamples images — necessary for big size reductions but visible if pushed too far. Our default is mostly lossless plus mild image downsampling.",
      },
      {
        q: "Why is my PDF still big after compression?",
        a: "It was probably already optimized, or the content is mostly text that compresses minimally. Try splitting into smaller PDFs or removing pages you don't need.",
      },
      {
        q: "Can compression damage my PDF?",
        a: "No. The compressed PDF is a new file — your original is untouched and stays in your workspace.",
      },
      {
        q: "Should I compress before or after merging?",
        a: "After. Merge first, then compress the merged file once. Compressing twice doesn't help and can introduce artifacts.",
      },
      {
        q: "Will compression remove signatures or annotations?",
        a: "No — signatures, annotations, and form fields are preserved. Only image bytes and unused metadata get optimized.",
      },
    ],
    related: ["compress-pdf-for-email", "compress-pdf-for-upload", "merge-pdf-for-portfolio"],
    ctaLabel: "Compress without losing quality",
  },

  // -----------------------------------------------------------------------
  // Merge PDF — 2 use cases
  // -----------------------------------------------------------------------
  {
    slug: "merge-pdf-for-resume",
    parentToolSlug: "merge-pdf",
    parentToolHref: "/tools/merge-pdf",
    category: "Merge PDF",
    h1: "Merge PDF for Resume — Combine Resume, Cover Letter & References",
    metaTitle: "Merge Resume and Cover Letter PDF | Combine Free | MyPDFKitty",
    metaDescription:
      "Combine your resume, cover letter, and references into one PDF for job applications. ATS-friendly, fits 5 MB portal limits. Free.",
    intro:
      "Most job applications expect a single PDF, not a folder of separate documents. Combining your resume, cover letter, and references (or portfolio samples) into one cleanly merged PDF makes you look organized and ensures the recruiter sees everything in the right order. Done badly, it produces a Frankenstein file with mismatched margins and font sizes. Done well, it's a one-page-resume + one-page-cover-letter + supporting-docs sequence that an ATS can still parse.",
    whatToKnow: [
      {
        title: "Standard order recruiters expect",
        body: "Page 1: cover letter (one page, addressed to a specific hiring manager if possible). Page 2: resume (one page for <10 years experience, two for senior roles). Pages 3+: references, transcripts, work samples — only if requested.",
      },
      {
        title: "ATS systems read merged PDFs fine",
        body: "Modern Applicant Tracking Systems (Workday, Greenhouse, Lever, iCIMS, Taleo) parse multi-page PDFs correctly as long as text stays as text — not images. Merging doesn't break parsing.",
      },
      {
        title: "Common ATS file size cap is 5 MB",
        body: "If your merged PDF goes over 5 MB, compress it before uploading. Most resume PDFs are under 1 MB; if yours is over, you've got a high-res photo or large image in there.",
      },
      {
        title: "Don't merge unsolicited extras",
        body: "If the application asks for a resume, send just the resume. Don't merge in your cover letter unless they asked. Don't merge references unless they asked. Recruiters skim — extras get skipped or flagged as not following instructions.",
      },
    ],
    steps: [
      { name: "Drop your files in order", text: "Cover letter first, resume second, supporting docs after. We keep the order you upload in." },
      { name: "Reorder if needed", text: "Drag pages to swap positions. Remove pages you don't need." },
      { name: "Merge", text: "We combine into a single PDF — original page sizes preserved, no quality loss." },
      { name: "Rename and upload", text: "Save as 'FirstName_LastName_Resume.pdf' (recruiter-friendly filename) and upload to the job portal." },
    ],
    tips: [
      "Save your cover letter and resume from Word or Google Docs as PDF directly — don't print-to-PDF, which sometimes rasterizes the text.",
      "If your cover letter and resume have different margins, the merged PDF will look uneven. Align them before merging if you care about visual polish.",
      "For senior roles, lead with the resume (page 1) and put the cover letter on page 2 — recruiters skim resumes first.",
      "If merged file exceeds 5 MB, run compress-pdf-for-upload after merging.",
    ],
    faq: [
      {
        q: "Will an ATS still parse my merged PDF?",
        a: "Yes — every modern ATS parses multi-page PDFs as long as text is selectable (not an image). Merging doesn't change that.",
      },
      {
        q: "Should I send my cover letter and resume as one PDF or separately?",
        a: "Follow the application's instructions. If it asks for both with one upload field, merge. If there are separate fields, keep them separate. When in doubt, separate is safer.",
      },
      {
        q: "What filename should I use?",
        a: "FirstName_LastName_Resume.pdf or FirstName_LastName_Application.pdf. Avoid spaces (some systems mangle them), and skip 'final', 'v2', 'updated' which look unprofessional.",
      },
      {
        q: "Can I merge a Word document with a PDF?",
        a: "Convert the Word doc to PDF first (use our Word-to-PDF tool), then merge.",
      },
      {
        q: "Will merging change my formatting?",
        a: "No — each source page is preserved exactly as it was. If you want unified formatting (matching fonts, headers), redesign in Word/Google Docs first then export to PDF.",
      },
    ],
    related: ["merge-pdf-for-portfolio", "compress-pdf-for-upload", "pdf-to-word-without-losing-formatting"],
    ctaLabel: "Merge your resume PDF",
  },
  {
    slug: "merge-pdf-for-portfolio",
    parentToolSlug: "merge-pdf",
    parentToolHref: "/tools/merge-pdf",
    category: "Merge PDF",
    h1: "Merge PDF for Portfolio — Combine Design, Architecture & Photo Work",
    metaTitle: "Merge Portfolio PDF Online Free | Designer & Architect | MyPDFKitty",
    metaDescription:
      "Combine portfolio pieces into a single PDF for clients, jobs, or grad school. Preserves image quality, easy to reorder, free in your browser.",
    intro:
      "A portfolio PDF is your highlight reel — usually 8–15 pages of best work, exported individually from InDesign, Figma, or Photoshop and then combined. The combine step is where most people lose either quality (bad merger compresses images) or order (alphabetical filenames produce a random sequence). Our merge tool keeps original image quality and lets you drag pages into the order you want.",
    whatToKnow: [
      {
        title: "Image quality stays the source quality",
        body: "We don't recompress on merge — your 300 DPI portfolio pages stay at 300 DPI. If the final file is too big to email, run compress-pdf-for-email after merging.",
      },
      {
        title: "Page size compatibility",
        body: "PDFs in your portfolio can be mixed sizes (US Letter, A4, custom landscape) and we preserve each page's original size. The final PDF won't auto-fit them all to one page size.",
      },
      {
        title: "Common portfolio sizes",
        body: "Landscape 11×8.5\" or 16×9 is most common for screen-first portfolios. Architecture portfolios use 11×17\" or A3 landscape. Photo portfolios trend toward 1:1 or 4:5 for Instagram-friendly viewing.",
      },
      {
        title: "Recipient expectations",
        body: "Most agencies and grad schools cap portfolio uploads at 25 MB. Some (RISD, Parsons, SVA) explicitly cap at 10 MB. Compress after merging to fit, or send a Behance / Issuu link if you have full-resolution work to show.",
      },
    ],
    steps: [
      { name: "Drop your pieces", text: "Upload each piece as a separate PDF. We accept any combination of page sizes." },
      { name: "Reorder by dragging", text: "Drag thumbnails into the order you want — usually strongest piece first, narrative middle, capstone project last." },
      { name: "Merge", text: "We combine into a single PDF preserving every page's original size and quality." },
      { name: "Compress if needed", text: "If the merged file is over 25 MB, run compress-pdf for a screen-quality version." },
    ],
    tips: [
      "Lead with your strongest piece — most reviewers spend 3 minutes on a portfolio. Make page 1 unforgettable.",
      "Use a cover page with your name, role, and contact info. Saves the reviewer from hunting.",
      "End with a 'thank you / contact' page. Same purpose: don't make them search for your email.",
      "If submitting to multiple programs / clients, save versioned files: 'Smith_Portfolio_RISD.pdf', 'Smith_Portfolio_Parsons.pdf' — easier to track which version you sent where.",
    ],
    faq: [
      {
        q: "Can I mix portrait and landscape pages in my portfolio PDF?",
        a: "Yes — we preserve each page's original orientation and size. Reviewers expect this in design portfolios.",
      },
      {
        q: "Will merging compress my high-res images?",
        a: "No — we don't recompress on merge. Your originals stay at full quality. If you need a smaller file for email, run compress separately after.",
      },
      {
        q: "What size should my portfolio PDF be?",
        a: "Aim for under 25 MB for email and most submission portals. RISD / Parsons / SVA cap at 10 MB. Use compress-pdf-for-upload if needed.",
      },
      {
        q: "Should my portfolio be one PDF or separate files?",
        a: "Almost always one PDF — easier for reviewers to flip through. Only split if a specific program asks for separate files.",
      },
      {
        q: "Can I add page numbers across the merged PDF?",
        a: "We preserve any page numbers in your source files. To add unified page numbers across the merged document, run our edit-pdf tool after merging.",
      },
    ],
    related: ["merge-pdf-for-resume", "compress-pdf-for-email", "pdf-to-jpg"],
    ctaLabel: "Merge your portfolio PDF",
  },

  // -----------------------------------------------------------------------
  // Sign PDF — 2 use cases
  // -----------------------------------------------------------------------
  {
    slug: "sign-pdf-nda",
    parentToolSlug: "sign-pdf",
    parentToolHref: "/tools/sign-pdf",
    category: "Sign PDF",
    h1: "Sign an NDA Online — In Under 60 Seconds",
    metaTitle: "Sign NDA Online Free | E-Sign Confidentiality Agreement | MyPDFKitty",
    metaDescription:
      "Sign a non-disclosure agreement (NDA) online for free. Drawn or typed signature, no account needed for the other party, legally binding under ESIGN.",
    intro:
      "NDAs are the most-signed business document in the world — every contractor, freelancer, and prospective employee signs at least one. The good news: you don't need a notary, a printer, or DocuSign to sign one. A typed or drawn electronic signature is legally binding under the U.S. ESIGN Act and EU eIDAS for standard NDAs. Drop the PDF here, sign in your browser, and email it back in under a minute.",
    whatToKnow: [
      {
        title: "Are e-signatures on NDAs legally binding?",
        body: "Yes, in the U.S. (ESIGN Act, 2000), EU (eIDAS, 2014), UK (Electronic Communications Act 2000), Canada (PIPEDA), and most major jurisdictions. Standard electronic signatures cover virtually all commercial NDAs. Qualified e-signatures (eIDAS QES) are only required in narrow regulated cases.",
      },
      {
        title: "What an enforceable e-signature requires",
        body: "Three things: (1) intent to sign — clicking 'sign' counts; (2) consent to do business electronically — opening the document and signing implies this; (3) attribution — the signature is associated with you, typically via your email or audit trail. Our tool records all three.",
      },
      {
        title: "Typed vs. drawn signatures",
        body: "Both are legally equivalent. Drawn signatures (with a mouse, trackpad, or finger on mobile) look more like a handwritten signature, which some recipients prefer optically. Typed signatures use an italic font and are faster to add. Pick whichever feels right for the recipient.",
      },
      {
        title: "When you actually need a notarized NDA",
        body: "Almost never for standard business NDAs. Notarization is required for some real estate, mortgage, and certain affidavit documents — if your NDA falls into that category (rare), it'll explicitly say 'notarized signature required.'",
      },
    ],
    steps: [
      { name: "Upload the NDA", text: "Drop the PDF you received. We handle most NDA templates (mutual, one-way, employment-related, simple confidentiality letters)." },
      { name: "Add your signature", text: "Type your name in script style, draw with your mouse / trackpad / finger, or upload an image of your written signature." },
      { name: "Place and date", text: "Drag the signature onto the signature line. Add the date in the date field if there is one." },
      { name: "Download and email back", text: "Download the signed PDF and reply to the email it came from. Done." },
    ],
    tips: [
      "Read the entire NDA before signing — especially the term length, definition of 'confidential information', and any non-compete or non-solicit clauses.",
      "If both parties need to sign, use our send-for-signature tool instead — it sends them a private link, gets their signature, and emails the fully-signed PDF back to both parties.",
      "Save the signed PDF in cloud storage (Google Drive, Dropbox) with a clear filename: 'NDA_CounterpartyName_2026-05-01.pdf'.",
      "Keep the email thread that delivered the NDA — it's part of your audit trail if there's ever a dispute.",
    ],
    faq: [
      {
        q: "Is a typed signature legally valid on an NDA?",
        a: "Yes. Under the U.S. ESIGN Act and EU eIDAS, electronic signatures (typed, drawn, or otherwise applied with intent) are legally equivalent to handwritten signatures for almost all business agreements including NDAs.",
      },
      {
        q: "Do I need to print, sign, scan, and email back?",
        a: "No — that's the long way. E-signing in your browser is faster, looks the same, and is legally equivalent.",
      },
      {
        q: "Can the other party see I signed electronically?",
        a: "Yes, but it doesn't matter — they almost certainly e-signed too. If they specifically ask for a 'wet signature' (handwritten on paper), they'll say so explicitly.",
      },
      {
        q: "What if the NDA is more than one page?",
        a: "Most NDAs require a signature only on the last page. Some also ask for initials on every page — drop initials field on each page if so.",
      },
      {
        q: "Should I use our send-for-signature tool instead?",
        a: "Yes if the other party also needs to sign. Send-for-signature handles bidirectional signing with a unified audit trail. If you're just signing and returning, the basic sign tool is faster.",
      },
    ],
    related: ["sign-pdf-on-iphone", "send-nda-for-signature", "send-contract-for-signature"],
    ctaLabel: "Sign your NDA now",
  },
  {
    slug: "sign-pdf-on-iphone",
    parentToolSlug: "sign-pdf",
    parentToolHref: "/tools/sign-pdf",
    category: "Sign PDF",
    h1: "Sign a PDF on iPhone — Without Printing or Scanning",
    metaTitle: "Sign PDF on iPhone Free | No App Install Needed | MyPDFKitty",
    metaDescription:
      "Sign PDF on iPhone in Safari — draw with your finger, type, or use a saved signature. No app install, no printing, no scanning.",
    intro:
      "iOS Markup (the built-in signature feature in Mail and Files) is fine for quick personal stuff but limited if you need to position the signature precisely, sign a multi-page contract, or share the signed PDF in a specific way. Our browser-based signer works in Safari on iPhone, lets you draw with your finger on the canvas, and outputs a clean PDF ready to email or upload.",
    whatToKnow: [
      {
        title: "Works in Safari, no app required",
        body: "Open mypdfkitty.com in Safari, upload the PDF, and sign. No App Store install, no Apple ID prompt, no in-app purchase upsell. The page is touch-optimized for finger drawing.",
      },
      {
        title: "iOS Markup vs. our signer",
        body: "iOS Markup: fastest if you just need a quick signature on a one-page PDF you're emailing back. Our signer: better if you need to place the signature precisely, sign multi-page documents with multiple fields, or want a typed signature in script style.",
      },
      {
        title: "How well finger drawing works",
        body: "Surprisingly well on modern iPhones — the touch sampling rate is high enough that signatures look natural. iPad with Apple Pencil is even better. If you want a perfectly clean signature, type it instead and we'll render in italic script.",
      },
      {
        title: "Privacy on mobile",
        body: "Same as desktop — files are uploaded to your private workspace, encrypted in transit and at rest, and auto-deleted on free plans after processing. Your signature drawing never leaves the page until you click submit.",
      },
    ],
    steps: [
      { name: "Open in Safari", text: "Tap to open the PDF in Safari (don't open in iBooks or Files — those go through iOS Markup instead)." },
      { name: "Upload", text: "Tap 'Choose PDF' and pick the file from Files, iCloud Drive, or your Photos." },
      { name: "Sign with finger", text: "Tap the signature field, choose 'Draw', and sign with your finger. Tap 'Type' if you'd rather type." },
      { name: "Save back", text: "Tap 'Apply', then 'Done' to download the signed PDF. Tap and hold to share via Mail, Messages, or save to Files." },
    ],
    tips: [
      "Hold your iPhone landscape — the signature canvas is wider, so your signature has more room to look natural.",
      "Use the Apple Pencil if you have an iPad and want a perfect signature.",
      "If iOS auto-zooms and your signature drawing breaks, double-tap to reset the zoom, then sign without zooming.",
      "Save your signed PDF to Files first, then attach to email — emailing directly from the share sheet sometimes downsamples the file.",
    ],
    faq: [
      {
        q: "Do I need to install an app to sign a PDF on iPhone?",
        a: "No. Safari + MyPDFKitty handles it without any install. iOS Markup (built into Mail) also works for quick signs but offers less control.",
      },
      {
        q: "Can I sign with Apple Pencil on iPad?",
        a: "Yes — Apple Pencil works in our signer on iPad and produces the cleanest signature look possible.",
      },
      {
        q: "What if the PDF is in my email?",
        a: "Tap the PDF attachment to open in Safari (long-press → 'Share' → 'Open in Safari') or save to Files first, then upload here.",
      },
      {
        q: "Will my signature be the same size on every page?",
        a: "Yes — once you've drawn or typed it, you can place the same signature on multiple pages at the same size.",
      },
      {
        q: "Is the signed PDF legally binding?",
        a: "Yes — same legal weight as a desktop e-signature. ESIGN Act doesn't care which device you used.",
      },
    ],
    related: ["sign-pdf-nda", "send-nda-for-signature", "send-contract-for-signature"],
    ctaLabel: "Sign your PDF on iPhone",
  },

  // -----------------------------------------------------------------------
  // Send for signature — 3 use cases
  // -----------------------------------------------------------------------
  {
    slug: "send-nda-for-signature",
    parentToolSlug: "send-for-signature",
    parentToolHref: "/tools/send-for-signature",
    category: "Send for signature",
    h1: "Send an NDA for Signature — Free Up to 10/Month",
    metaTitle: "Send NDA for Signature Free | E-Sign Workflow | MyPDFKitty",
    metaDescription:
      "Send an NDA to be signed online — free for the first 10 envelopes per month. Recipients sign in their browser, no account needed, full audit trail included.",
    intro:
      "Sending an NDA for the other party to sign is a daily task at most companies that work with freelancers, contractors, or prospective hires. DocuSign charges $15/user/month for this. We do it free up to 10 envelopes per month, with the same audit trail and zero account requirement for recipients. Drop your NDA, add the counterparty's name and email, drag a signature field, hit send. They get a private link, sign in their browser, and you get the signed PDF emailed back.",
    whatToKnow: [
      {
        title: "Recipients don't need an account",
        body: "The signing link is a unique 256-bit token. Your counterparty clicks it, signs, and submits. No MyPDFKitty signup, no DocuSign account, no software install. They never see our marketing site.",
      },
      {
        title: "Audit certificate is automatic",
        body: "Every fully-signed NDA gets a certificate page appended with the envelope ID, every signer's name and email, view + sign timestamps in UTC, and the signing IP address. This is the audit trail courts look at if there's ever a dispute.",
      },
      {
        title: "Mutual NDAs work the same way",
        body: "Add yourself as a recipient too — drag your signature field on the page, then drag the counterparty's signature field. We send each of you a private link. The PDF is finalized only when both signatures are in.",
      },
      {
        title: "Reminder workflow",
        body: "If they haven't signed in a day, click 'Remind' on the envelope page and we'll re-send the invite email. Rate-limited to one reminder per recipient per hour to keep it polite.",
      },
    ],
    steps: [
      { name: "Upload the NDA PDF", text: "Drop your NDA template — mutual, one-way, employment, or any custom version." },
      { name: "Add the counterparty", text: "Enter their name and email. Add yourself as a second recipient if it's a mutual NDA." },
      { name: "Place signature fields", text: "Drag a signature field onto each signer's signature line. Add a date field if the NDA has one." },
      { name: "Send", text: "Click send. They get an email with their unique link. You get notified when they sign." },
    ],
    tips: [
      "Subject line matters — set the envelope subject to 'NDA — [YourCompany] / [TheirCompany]' so it's findable in their inbox.",
      "Add a short personal message: 'Hi Sarah, here's the NDA we discussed. Standard mutual terms — let me know if you have questions.'",
      "If the NDA needs initials on each page, drop initial fields on every page — most enforceable NDAs have signature lines on the last page only.",
      "Save the completed PDF and audit cert in your CRM (HubSpot, Salesforce) attached to the contact record.",
    ],
    faq: [
      {
        q: "Is sending an NDA via MyPDFKitty legally binding?",
        a: "Yes — under the U.S. ESIGN Act and EU eIDAS, electronic signatures are legally equivalent to handwritten ones for standard business agreements including NDAs. The audit trail (timestamps, IPs, email confirmation) reinforces enforceability.",
      },
      {
        q: "What if the counterparty has questions or wants to redline the NDA?",
        a: "They can decline to sign in our signing flow with an optional reason. You'll get notified, send them a revised PDF, and start a new envelope.",
      },
      {
        q: "Does the counterparty need to install anything?",
        a: "No. They click the link in their email and sign in their browser — desktop or mobile. No app, no MyPDFKitty account, no Adobe Reader install.",
      },
      {
        q: "How many envelopes can I send for free?",
        a: "10 per month on the Free plan. Kitty Plus ($2.99/month) increases that to 50, Pro to 200, Business to 1,000.",
      },
      {
        q: "Can I cancel a sent NDA?",
        a: "Yes — open the envelope and click Cancel. Recipients who haven't signed will lose access to the document.",
      },
    ],
    related: ["sign-pdf-nda", "send-contract-for-signature", "send-offer-letter-for-signature"],
    ctaLabel: "Send your NDA for signature",
  },
  {
    slug: "send-contract-for-signature",
    parentToolSlug: "send-for-signature",
    parentToolHref: "/tools/send-for-signature",
    category: "Send for signature",
    h1: "Send a Contract for Signature — Multi-Party, Free Up to 10/Month",
    metaTitle: "Send Contract for Signature Free | Multi-Party E-Sign | MyPDFKitty",
    metaDescription:
      "Send service agreements, SOWs, and contracts for online signature. Multi-party signing, audit trail, free up to 10 envelopes per month.",
    intro:
      "Service agreements, SOWs, and master service contracts often have two or more parties — client, vendor, sometimes a guarantor or third party. Sending the contract for signature shouldn't require a $50/month per-user DocuSign Business seat. Our send-for-signature handles up to 10 signers per envelope, gives each one a private link, and emails the fully-executed PDF to everyone when the last signature is in.",
    whatToKnow: [
      {
        title: "Multi-party signing is included",
        body: "Add up to 10 recipients per envelope. Each gets their own signing link, their own assigned fields, and their own role in the audit trail. No upcharge for parties 2 through 10.",
      },
      {
        title: "Field types beyond signature",
        body: "Drop signature, initials (for per-page initials), date, text (e.g., 'Effective Date'), and checkbox fields. Each field is assigned to one specific recipient, so signers only fill what's theirs.",
      },
      {
        title: "Sequential vs. parallel signing",
        body: "Today everyone signs in parallel — all recipients get their links at the same time. If you need sequential signing (Party A signs first, then Party B sees the document with Party A's signature), tell us — it's on the roadmap.",
      },
      {
        title: "Where the signed PDF lives",
        body: "Final signed contract is stored in your account workspace, downloadable any time. Each recipient also gets the final PDF attached to their completion email. Free plan keeps signed PDFs for 90 days; paid plans keep them indefinitely.",
      },
    ],
    steps: [
      { name: "Upload the contract", text: "Drop your service agreement, SOW, or contract PDF." },
      { name: "Add all parties", text: "Enter name + email for each signer (you, the client, any third parties)." },
      { name: "Place fields per signer", text: "Drag signature, initials, date, and text fields onto the page. Color-coded per signer so you don't mix them up." },
      { name: "Send", text: "Each party gets their private link. You'll see real-time status (sent / viewed / signed) in your dashboard." },
    ],
    tips: [
      "For long contracts, drop initials fields on every page so each signer initials each page — common practice for high-stakes agreements.",
      "Use the message field to summarize what's in the contract: 'Here's the SOW for Project X — Net 30 terms, $50K total, Q3 timeline.'",
      "If the contract has an 'Effective Date' that fills in automatically, use a date field — we pre-populate it with today's date for the signer.",
      "Send to all parties at once unless you have a strict order requirement. Parallel signing is faster.",
    ],
    faq: [
      {
        q: "How many parties can sign one contract?",
        a: "Up to 10 recipients per envelope. Each gets their own signing link and their own assigned fields.",
      },
      {
        q: "Can I get notified each time someone signs?",
        a: "Yes — you'll get an email when each recipient signs, plus a final completion email with the fully-executed PDF when everyone is done.",
      },
      {
        q: "What if one party refuses to sign?",
        a: "They can decline to sign in the signing flow. You'll be notified and can re-send a revised version or cancel the envelope.",
      },
      {
        q: "Is the signed contract enforceable?",
        a: "Standard electronic signatures under U.S. ESIGN Act, EU eIDAS, and most major jurisdictions are legally equivalent to wet signatures for commercial contracts. The audit certificate (signer name, email, IP, timestamps) reinforces this.",
      },
      {
        q: "Can I require initials on every page?",
        a: "Yes — drop an initials field on every page for each signer. They'll go through and initial each one.",
      },
    ],
    related: ["send-nda-for-signature", "send-offer-letter-for-signature", "sign-pdf-nda"],
    ctaLabel: "Send your contract for signature",
  },
  {
    slug: "send-offer-letter-for-signature",
    parentToolSlug: "send-for-signature",
    parentToolHref: "/tools/send-for-signature",
    category: "Send for signature",
    h1: "Send an Offer Letter for Signature — Free, Branded, In Minutes",
    metaTitle: "Send Offer Letter for Signature Free | Hiring | MyPDFKitty",
    metaDescription:
      "Send job offer letters for e-signature. Free up to 10/month, audit trail included, no DocuSign account required for the candidate.",
    intro:
      "Sending an offer letter is the most exciting moment in hiring — and you don't want it stuck in a printer queue or buried in a complex DocuSign workflow. Drop the offer letter, add the candidate, drag a signature field, send. They get a polished signing experience, you get the signed PDF in minutes, and HR has a clean audit trail with view and sign timestamps.",
    whatToKnow: [
      {
        title: "Speed-to-signed matters in hiring",
        body: "From email send to signature: average is 3 hours when the experience is friction-free. The longer it takes, the more chance the candidate gets a counter-offer or has second thoughts. Browser-based signing with no account requirement is the fastest path.",
      },
      {
        title: "What's typically in an offer letter",
        body: "Position title, start date, base salary or hourly rate, equity / bonus terms, reporting structure, employment classification (W-2 / 1099 / contractor), at-will language, signature lines for the candidate and the hiring manager. Keep it under 2 pages — anything longer is a contract.",
      },
      {
        title: "Both sides usually sign",
        body: "Add yourself (or the hiring manager) as a recipient too. Mutual signing is standard for offer letters — it shows the company is committed, not just the candidate.",
      },
      {
        title: "When to use a contract instead",
        body: "If your offer includes complex equity vesting, change-of-control clauses, IP assignment, or non-compete details, that's a contract — drop it into our send-contract-for-signature flow with multiple field types.",
      },
    ],
    steps: [
      { name: "Upload the offer letter", text: "Drop the offer letter PDF (signed by HR / hiring manager already, or unsigned)." },
      { name: "Add candidate + hiring manager", text: "Add the candidate's name and email. Add the hiring manager as a second signer." },
      { name: "Place signature fields", text: "Signature for the candidate on their line, signature for the hiring manager on theirs. Date fields where the letter has them." },
      { name: "Send", text: "Both parties get their private link. The candidate signs first, then the hiring manager — or in parallel if you don't care about order." },
    ],
    tips: [
      "Use a personal message: 'Hi Alex, the team is so excited to have you. Here's your offer for the Senior Engineer role — let me know if you have any questions before signing.'",
      "Set a reasonable deadline in the offer letter (5–7 business days is standard) so the candidate isn't sitting on it for a month.",
      "If the candidate declines or wants to negotiate, void the envelope and send a revised version — keeps your audit history clean.",
      "Save the signed offer letter in your HRIS (Rippling, Gusto, BambooHR) attached to the new hire record.",
    ],
    faq: [
      {
        q: "Is an e-signed offer letter legally binding?",
        a: "Yes — under U.S. ESIGN Act and EU eIDAS, electronic signatures are legally equivalent to handwritten ones for offer letters and most employment-related agreements.",
      },
      {
        q: "Should both the candidate and hiring manager sign?",
        a: "Yes — mutual signing is standard. It shows the company is making a commitment, not just the candidate. Add both as recipients in the envelope.",
      },
      {
        q: "What if the candidate wants to negotiate before signing?",
        a: "Void the envelope, send the revised letter with new terms. Avoid letting them sign an outdated version that you'll need to amend.",
      },
      {
        q: "Can I send offer letters at scale (e.g., for a hiring spree)?",
        a: "Each offer letter is its own envelope (each candidate gets their own signing link). You can send multiple in a row — each one counts toward your monthly envelope limit.",
      },
      {
        q: "Where does the signed offer letter go?",
        a: "Stored in your dashboard for download. Both you and the candidate also receive the fully-signed PDF by email automatically.",
      },
    ],
    related: ["send-nda-for-signature", "send-contract-for-signature", "sign-pdf-nda"],
    ctaLabel: "Send your offer letter for signature",
  },

  // -----------------------------------------------------------------------
  // PDF→Word — 1 use case
  // -----------------------------------------------------------------------
  {
    slug: "pdf-to-word-without-losing-formatting",
    parentToolSlug: "pdf-to-word",
    parentToolHref: "/tools/pdf-to-word",
    category: "PDF to Word",
    h1: "PDF to Word Without Losing Formatting",
    metaTitle: "PDF to Word Without Losing Formatting | Free | MyPDFKitty",
    metaDescription:
      "Convert PDF to editable Word document while preserving fonts, layout, and tables. Best for resumes, contracts, and reports. Free in your browser.",
    intro:
      "The dream conversion: PDF in, perfectly editable Word doc out, fonts intact, tables aligned, no ASCII salad. Reality is messier — some PDFs were never editable Word in the first place (they're scans, or they were generated from InDesign), and even the cleanest PDFs require layout judgment to convert. Our converter does the best-possible round-trip: text stays as text, paragraphs stay as paragraphs, tables stay as tables when possible, and fonts substitute to the closest available match.",
    whatToKnow: [
      {
        title: "What converts cleanly",
        body: "PDFs originally exported from Word (.docx → PDF): near-perfect round-trip. Linear text reports, articles, simple letters: clean. Forms with text fields: clean. Resumes with simple two-column layouts: usually clean.",
      },
      {
        title: "What needs cleanup",
        body: "Heavy multi-column layouts (newsletters, magazines): paragraph order may shuffle. Complex tables with merged cells: structure preserved but cell merging may need fixing. Custom fonts: substituted with a similar Word-default font.",
      },
      {
        title: "What requires OCR first",
        body: "Scanned PDFs (paper scanned to PDF) have no text — just images of text. Run our OCR PDF tool first, then convert the OCR'd PDF to Word. Otherwise the Word doc will be blank or contain image objects.",
      },
      {
        title: "Why fonts don't always match exactly",
        body: "PDFs embed fonts that aren't installed on your computer. When converting to Word, we substitute to the closest font Word has natively. To restore the original look, install the font on your machine and Word will use it automatically.",
      },
    ],
    steps: [
      { name: "Upload your PDF", text: "Drop the PDF. We accept up to 25 MB on free, 250 MB on Pro." },
      { name: "Convert", text: "We extract text in reading order and rebuild paragraphs. Tables and lists are preserved when detectable." },
      { name: "Download .docx", text: "Open in Microsoft Word, Google Docs, or LibreOffice — fully editable." },
      { name: "Review and edit", text: "Quick scan for layout: check headers, table cells, and any odd line breaks. Most PDFs need 5 minutes of cleanup." },
    ],
    tips: [
      "If the PDF is a resume, expect to spend 2–3 minutes fixing line breaks and bullet alignment after conversion.",
      "If your PDF was originally a Word file, ask the sender for the .docx — round-tripping through PDF always loses some fidelity.",
      "If the converted Word doc looks like garbage, the PDF is probably a scan. Run OCR first, then convert.",
      "Save the converted .docx with a new filename so you don't accidentally overwrite the original PDF.",
    ],
    faq: [
      {
        q: "Will the Word document look exactly like the PDF?",
        a: "Close, not exact. Text and structure transfer accurately. Custom fonts substitute, and complex layouts may need a few minutes of cleanup. For Word-originated PDFs, the round-trip is near-perfect.",
      },
      {
        q: "Can I edit a scanned PDF in Word?",
        a: "Not directly — scanned PDFs are images, not text. Run OCR PDF first to convert images of text into real text, then convert the OCR'd PDF to Word.",
      },
      {
        q: "Does this work for resumes?",
        a: "Yes — resumes are one of the cleanest conversions. Expect minor cleanup for bullet alignment and possibly font substitution.",
      },
      {
        q: "Will tables stay as tables in Word?",
        a: "Yes when our converter detects them. Complex tables with merged cells or nested tables may need cell-merge fixes after conversion.",
      },
      {
        q: "Is the Word doc editable in Google Docs?",
        a: "Yes — .docx imports fully into Google Docs with all editable text and tables.",
      },
    ],
    related: ["compress-pdf-for-upload", "merge-pdf-for-resume", "fill-out-pdf-form-online"],
    ctaLabel: "Convert PDF to Word",
  },

  // -----------------------------------------------------------------------
  // Edit PDF — 1 use case
  // -----------------------------------------------------------------------
  {
    slug: "fill-out-pdf-form-online",
    parentToolSlug: "edit-pdf",
    parentToolHref: "/tools/edit-pdf",
    category: "Edit PDF",
    h1: "Fill Out a PDF Form Online — No Printing, No App",
    metaTitle: "Fill Out PDF Form Online Free | No Install | MyPDFKitty",
    metaDescription:
      "Fill out PDF forms in your browser — tax forms, applications, intake forms. Type into fields, sign, and download. Free, no install.",
    intro:
      "PDF forms come in two flavors: 'fillable' (the form has clickable text fields built in) and 'flat' (it's a printed-style form with no interactive fields, even though it's a PDF). Both can be filled in your browser. For fillable forms, click each field and type. For flat forms, drop text and signature fields wherever you need them. Either way, you get an editable, professional-looking output without printing, scanning, or installing anything.",
    whatToKnow: [
      {
        title: "Fillable vs. flat forms",
        body: "Fillable: form has interactive fields (you can click and type). Examples: most IRS tax forms, USCIS forms, modern application PDFs. Flat: form is just a static PDF (no clickable fields). Examples: scanned forms, some legacy government forms, PDFs exported from a printed template.",
      },
      {
        title: "Common fillable forms",
        body: "IRS tax forms (W-9, W-4, 1040, Schedule C, etc.): fully fillable. USCIS forms (I-130, I-485, N-400): fillable. Most modern intake forms from healthcare, legal, and financial providers: fillable.",
      },
      {
        title: "What to do with flat forms",
        body: "Use our edit-pdf tool to drop text fields wherever you need to type. We render every field cleanly — no awkward strikethroughs or floating text boxes. The output looks like a properly-filled-out form, not a marked-up scan.",
      },
      {
        title: "Signing the form",
        body: "Most forms require a signature at the bottom. Use our sign-pdf flow to draw or type your signature, then place it on the signature line. The result is indistinguishable from a printed-and-signed form.",
      },
    ],
    steps: [
      { name: "Upload your form", text: "Drop the PDF. We auto-detect whether it has fillable fields." },
      { name: "Fill the fields", text: "If fillable: click and type into each field. If flat: drag text fields onto the form wherever you need to type." },
      { name: "Sign", text: "Add a signature on the signature line — drawn or typed." },
      { name: "Download", text: "Save the filled form as a new PDF, ready to email or upload." },
    ],
    tips: [
      "For tax forms, double-check every box before signing — the IRS doesn't accept amended W-9s as easily as you'd hope.",
      "If the form has checkboxes, click them once to check (we render an X). Click again to uncheck.",
      "Use 12pt for form text fields — matches the form's printed text size and looks professional.",
      "Save the unfilled blank form too. If you need to fill it again next year (W-9 etc.), you have a clean copy.",
    ],
    faq: [
      {
        q: "Can I fill out IRS tax forms with this?",
        a: "Yes — IRS forms (W-9, W-4, 1040, etc.) are fillable PDFs. Open in our editor, click each field, and type your information.",
      },
      {
        q: "What if the form doesn't have interactive fields?",
        a: "It's a 'flat' form. Use our edit-pdf tool to drop text and signature fields anywhere on the page — no need to print and scan.",
      },
      {
        q: "Will the filled form be accepted by the recipient?",
        a: "Yes — the output is a normal PDF that looks like a properly-filled form. USCIS, IRS, and almost all modern recipients accept e-filled PDFs without issue.",
      },
      {
        q: "Can I save my progress and come back later?",
        a: "Sign in to save filled forms to your workspace. Without an account, finish in one session.",
      },
      {
        q: "Is it safe to fill out tax forms online?",
        a: "Yes — files are isolated to your private workspace, encrypted in transit and at rest, and we never share or analyze your data. Sensitive forms (SSN, tax info) stay private.",
      },
    ],
    related: ["sign-pdf-nda", "pdf-to-word-without-losing-formatting", "compress-pdf-for-upload"],
    ctaLabel: "Fill out your PDF form",
  },
];

export function findUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}

export function relatedUseCases(slugs: string[]): UseCase[] {
  return slugs.map(findUseCase).filter((u): u is UseCase => Boolean(u));
}
