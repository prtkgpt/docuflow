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
  // -----------------------------------------------------------------------
  // Round 2 — twelve more high-intent scenarios
  // -----------------------------------------------------------------------

  // Redact PDF
  {
    slug: "redact-pdf",
    parentToolSlug: "edit-pdf",
    parentToolHref: "/tools/edit-pdf",
    category: "Edit PDF",
    h1: "Redact a PDF — Permanently Hide Sensitive Info",
    metaTitle: "Redact PDF Online Free | Permanently Black Out Text | MyPDFKitty",
    metaDescription:
      "Redact a PDF to permanently hide names, SSNs, account numbers, or any sensitive info. Black-box redactions that survive copy-paste and OCR.",
    intro:
      "Redacting a PDF means permanently removing sensitive information — not just covering it with a black rectangle that anyone can move out of the way in Acrobat. Real redaction strips the underlying text and the visible glyphs, so even copy-paste, search, and OCR-on-the-redacted-file can't recover the hidden data. This is what you need before sharing contracts, court filings, financial records, or anything covered by HIPAA, GDPR, or attorney-client privilege.",
    whatToKnow: [
      {
        title: "Real redaction vs. fake redaction",
        body: "Fake: drawing a black rectangle over text in a regular PDF editor. The text underneath stays in the file — courts have caught lawyers exposing client SSNs because their 'redactions' were just shapes. Real: the text is removed from the underlying PDF and replaced with a solid black region. Our redact tool does the second.",
      },
      {
        title: "What you should redact",
        body: "Social Security numbers, full credit-card numbers, bank account numbers, dates of birth, home addresses (in court filings), names of minors, medical records (HIPAA), client identifiers (attorney-client), and trade secrets in contracts shared with vendors.",
      },
      {
        title: "Redaction is irreversible",
        body: "Once you save a redacted PDF, you can't recover the hidden text — even from your own file. Always keep the original (un-redacted) PDF in a secure location separately. Name the redacted version clearly: 'Smith_Contract_REDACTED.pdf'.",
      },
      {
        title: "Don't forget metadata",
        body: "PDF metadata (Author, Title, Comments) often contains identifiers that survive redaction. Our tool strips metadata on save by default, but double-check by opening File → Properties in Acrobat or Preview after redacting.",
      },
    ],
    steps: [
      { name: "Upload the PDF", text: "Drop the file containing the sensitive info." },
      { name: "Mark the redactions", text: "Drag boxes over names, numbers, addresses — anything you need to hide. Each becomes a redaction marker." },
      { name: "Apply", text: "We strip the underlying text and burn the black region into the PDF. The text is gone, not just covered." },
      { name: "Verify and save", text: "Save the redacted PDF. Open it again and try to copy text from the redacted regions — should produce nothing." },
    ],
    tips: [
      "After applying redactions, run the PDF through Find (Ctrl/Cmd+F) and search for any sensitive term you redacted. If it returns hits, redaction failed — start over.",
      "For court filings, follow the court's specific redaction rules — some require the redacted text to be replaced with [REDACTED] tags rather than blackboxes.",
      "Redact, then compress. Order matters — compressing first can rasterize text, which makes redaction harder to verify.",
      "For high-stakes redactions (litigation, regulatory filings), have a colleague verify the output independently before sending.",
    ],
    faq: [
      {
        q: "Can someone recover redacted text?",
        a: "Not from a properly redacted PDF — the text is removed from the underlying document, not just covered. Black-box overlays in basic editors can be moved aside; real redactions can't.",
      },
      {
        q: "Does redaction work on scanned PDFs?",
        a: "Yes — redacting a scan blacks out the image region. Run OCR before sharing if the PDF needs to be searchable, then redact the OCR'd text.",
      },
      {
        q: "Is this OK for HIPAA / GDPR compliance?",
        a: "Real redaction removes the underlying data, which satisfies the technical bar for HIPAA and GDPR. You're still responsible for the broader compliance program (consent, breach notification, data retention).",
      },
      {
        q: "Can I redact text in multiple PDFs at once?",
        a: "Pro and Business plans include batch processing. Free and Plus process one file at a time.",
      },
      {
        q: "What about metadata and hidden text?",
        a: "We strip standard PDF metadata (Author, Title, Comments) on save. For maximum safety, also remove document-level annotations and bookmarks before sharing.",
      },
    ],
    related: ["fill-out-pdf-form-online", "compress-pdf-for-upload", "send-contract-for-signature"],
    ctaLabel: "Redact your PDF",
  },

  // Add page numbers
  {
    slug: "add-page-numbers-to-pdf",
    parentToolSlug: "edit-pdf",
    parentToolHref: "/tools/edit-pdf",
    category: "Edit PDF",
    h1: "Add Page Numbers to a PDF Online",
    metaTitle: "Add Page Numbers to PDF Free Online | MyPDFKitty",
    metaDescription:
      "Add page numbers to a PDF in your browser — bottom right, bottom center, or any custom position. Style the format and start at any number.",
    intro:
      "Page numbers seem trivial until you need them on a 60-page report and you're trying to do it in Word. Print PDF, scan, give up. Adding page numbers to an existing PDF takes 10 seconds in our editor — pick a position (bottom-center is conventional), pick a format (1, 2, 3 or Page 1 of 60), pick a starting number, done.",
    whatToKnow: [
      {
        title: "Where to put page numbers",
        body: "Bottom-center is the most common (academic papers, reports, books). Bottom-right is common for legal filings and contracts. Top-right is common for technical documentation. Avoid bottom-left — it conflicts with margin notes in some templates.",
      },
      {
        title: "Common formats",
        body: "Plain: 1, 2, 3. With label: Page 1, Page 2. With total: Page 1 of 60. Roman numerals: i, ii, iii (used for prefatory matter — title page, TOC). Custom prefix: Section A.1, Section A.2 — useful for multi-section documents.",
      },
      {
        title: "Skip pages or start mid-document",
        body: "Title pages, TOCs, and acknowledgements are usually unnumbered or numbered with Roman numerals. We let you exclude specific pages or restart numbering at any page (e.g., Arabic 1 starts on page 5, the first page of Chapter 1).",
      },
      {
        title: "Don't double-up",
        body: "If your PDF already has page numbers (e.g., it was printed from Word with page numbers in the footer), adding more will produce two sets of page numbers. Remove the existing ones with our edit-pdf tool first, or skip the affected pages.",
      },
    ],
    steps: [
      { name: "Upload the PDF", text: "Drop your report, contract, or book draft." },
      { name: "Pick position and format", text: "Bottom-center, bottom-right, top-right, etc. Format as 1, 2, 3 or Page 1 of N." },
      { name: "Set starting page (optional)", text: "Start numbering on page 5 instead of page 1, or use Roman numerals for the first 4 pages." },
      { name: "Apply and download", text: "Page numbers are written into the PDF and travel with the file." },
    ],
    tips: [
      "Match your page-number font to the body text font when possible. Helvetica or Times in 10pt is standard.",
      "For double-sided printing, use 'Page X of Y' so readers know how many pages remain.",
      "Add a header/footer rule (a thin line) above page numbers in formal documents — looks more polished.",
      "Save the original without page numbers in case you need to renumber later.",
    ],
    faq: [
      {
        q: "Can I number only pages 5–60 and leave 1–4 unnumbered?",
        a: "Yes — exclude pages 1–4 in our numbering options. Common for reports with title page, TOC, etc.",
      },
      {
        q: "How do I use Roman numerals for the front matter?",
        a: "Apply numbering twice: pass 1 for pages 1–4 in Roman numerals (i, ii, iii, iv), pass 2 for pages 5+ in Arabic (1, 2, 3...).",
      },
      {
        q: "Can I customize the page number font and color?",
        a: "Yes — pick from common fonts (Helvetica, Times) and any color. Default is black 10pt Helvetica.",
      },
      {
        q: "Will the page numbers print correctly?",
        a: "Yes — they're embedded in the PDF as text, so they print exactly where you placed them.",
      },
      {
        q: "Can I use 'Page X of Y' format?",
        a: "Yes — pick the 'Page X of Y' template. Y is auto-set to your total page count.",
      },
    ],
    related: ["fill-out-pdf-form-online", "merge-pdf-for-portfolio", "extract-pages-from-pdf"],
    ctaLabel: "Add page numbers",
  },

  // Extract pages
  {
    slug: "extract-pages-from-pdf",
    parentToolSlug: "split-pdf",
    parentToolHref: "/tools/split-pdf",
    category: "Split PDF",
    h1: "Extract Pages from a PDF",
    metaTitle: "Extract Pages from PDF Online Free | MyPDFKitty",
    metaDescription:
      "Pull specific pages from a PDF into a new file. Single page, page ranges, or non-contiguous pages — fast and free in your browser.",
    intro:
      "Extracting pages is useful when you only need a slice of a longer PDF — sending pages 5-10 of a 100-page contract for review, pulling just your tax form from a packet of statements, or grabbing the executive summary from a quarterly report. Drop the PDF, pick the pages, get a clean new PDF that contains only what you needed.",
    whatToKnow: [
      {
        title: "Single, range, or non-contiguous",
        body: "Pull just page 7. Pull pages 5–10 as a range. Pull pages 1, 3, 5, 12–15 as a non-contiguous set. We support all three patterns.",
      },
      {
        title: "Original is preserved",
        body: "Extracting doesn't modify the source PDF — you get a new file with the extracted pages. The original stays untouched in your workspace.",
      },
      {
        title: "Order is preserved unless you reorder",
        body: "Pages come out in the order you specified. If you list 5, 1, 7, the output PDF has page 5 first, then 1, then 7. Useful for re-sequencing.",
      },
      {
        title: "Bookmarks and links",
        body: "Internal links between extracted pages survive. Links to pages you didn't extract become broken — we strip them rather than leave dangling targets.",
      },
    ],
    steps: [
      { name: "Upload the PDF", text: "Drop the source file." },
      { name: "Select the pages", text: "Type page numbers (e.g., '5, 7-12, 20') or click thumbnails to pick visually." },
      { name: "Extract", text: "We assemble a new PDF with just those pages, preserving formatting and quality." },
      { name: "Download", text: "Save the new PDF — usually much smaller than the original." },
    ],
    tips: [
      "Use the thumbnail view if you don't remember exact page numbers — faster than counting.",
      "If you're sending an extract for review, rename to 'Smith_Contract_pages-5-to-10.pdf' so the recipient knows what they're getting.",
      "Extract first, then redact, then send — keeps your workflow tidy and avoids accidentally redacting in the original.",
      "For very large PDFs (>100 pages), extract by section then merge if you need a custom selection.",
    ],
    faq: [
      {
        q: "What's the difference between extracting and splitting?",
        a: "Splitting divides the PDF into multiple files (one per page or per range). Extracting pulls specific pages into a single new file. Same tool, different output settings.",
      },
      {
        q: "Can I reorder pages while extracting?",
        a: "Yes — list page numbers in any order, and the output PDF follows that order. Page 5 first, then page 1, then page 12 is fine.",
      },
      {
        q: "Will extraction lower the quality?",
        a: "No — extracted pages keep the original quality bit-for-bit. Same fonts, images, and dimensions.",
      },
      {
        q: "Can I extract pages from a password-protected PDF?",
        a: "Remove the password first using our unlock tool, then extract. We don't bypass passwords.",
      },
      {
        q: "How many pages can I extract at once?",
        a: "Any number, up to your plan's max upload size. Free 25 MB, Pro 250 MB.",
      },
    ],
    related: ["remove-pages-from-pdf", "merge-pdf-for-resume", "compress-pdf-for-email"],
    ctaLabel: "Extract pages from your PDF",
  },

  // Remove pages
  {
    slug: "remove-pages-from-pdf",
    parentToolSlug: "split-pdf",
    parentToolHref: "/workspace?tool=delete",
    category: "Split PDF",
    h1: "Remove Pages from a PDF",
    metaTitle: "Remove Pages from PDF Online Free | MyPDFKitty",
    metaDescription:
      "Delete specific pages from a PDF — a single page, a range, or scattered pages. Free in your browser, no install.",
    intro:
      "Sometimes you don't want to extract a slice — you want to keep the whole PDF minus a few pages. Maybe page 3 has a typo and you have a corrected replacement. Maybe you scanned a 50-page document and the cover page came out blank. Removing pages is one click per page; the rest stays exactly as it was.",
    whatToKnow: [
      {
        title: "Removing vs. extracting",
        body: "Removing keeps everything except the pages you specify (subtract). Extracting keeps only the pages you specify (additive). Same tool, opposite mode.",
      },
      {
        title: "What gets recalculated",
        body: "Page numbers shift after removal — page 4 becomes page 3 if you deleted page 1. If your PDF has internal page references ('see page 8'), those become incorrect. Use the edit-pdf tool to fix references after removal.",
      },
      {
        title: "Bookmarks and TOC",
        body: "Bookmarks pointing to removed pages are dropped. The TOC's page numbers are static text and need manual update if your TOC was already in the PDF.",
      },
      {
        title: "When to use the editor instead",
        body: "If you're removing pages because they have errors (typos, wrong figures), consider editing the page directly with our edit-pdf tool. Faster than removing + re-inserting a corrected page.",
      },
    ],
    steps: [
      { name: "Upload the PDF", text: "Drop the source file." },
      { name: "Select pages to remove", text: "Click thumbnails to mark pages for deletion, or type page numbers." },
      { name: "Apply", text: "We rebuild the PDF without those pages, preserving everything else." },
      { name: "Download", text: "Save the smaller PDF." },
    ],
    tips: [
      "Always keep the original — once removed, pages are gone from the new file. Original PDF stays in your workspace.",
      "Remove first, then add page numbers if needed — page numbers will reflect the new sequence.",
      "If you're cleaning up a big PDF (deleting blank scan pages, ad pages, etc.), use thumbnail view and delete in batches.",
      "After removing pages from a contract or legal doc, double-check the page references in the body still make sense.",
    ],
    faq: [
      {
        q: "Can I remove every other page?",
        a: "Yes — list the even or odd page numbers (2, 4, 6, ... or 1, 3, 5, ...) in the remove list.",
      },
      {
        q: "Will the file get smaller?",
        a: "Yes, proportional to how many pages you removed. A 100-page PDF with 20 removed becomes ~80% the size, give or take.",
      },
      {
        q: "Can I undo a removal?",
        a: "The new PDF is a separate file. Your original stays in your workspace untouched, so you can always start over.",
      },
      {
        q: "Does removing pages re-flow the layout?",
        a: "No — each remaining page is preserved exactly as it was. Only the page sequence changes.",
      },
      {
        q: "What about embedded form fields?",
        a: "Form fields on remaining pages stay functional. Form fields on removed pages disappear with the page.",
      },
    ],
    related: ["extract-pages-from-pdf", "add-page-numbers-to-pdf", "compress-pdf-for-email"],
    ctaLabel: "Remove pages from your PDF",
  },

  // PDF to Word — resume use case
  {
    slug: "pdf-to-word-resume",
    parentToolSlug: "pdf-to-word",
    parentToolHref: "/tools/pdf-to-word",
    category: "PDF to Word",
    h1: "Convert PDF Resume to Word — Editable, ATS-Friendly",
    metaTitle: "Convert PDF Resume to Word Free | ATS Friendly | MyPDFKitty",
    metaDescription:
      "Convert your PDF resume to an editable Word document. Preserves bullets, headers, and ATS-friendly formatting. Free in your browser.",
    intro:
      "You have a PDF resume that you want to update — maybe add a new job, tweak a bullet, or tailor for a specific role. Editing PDF directly is awkward; round-tripping to Word is the obvious move. The trick is keeping the layout intact: bullets aligned, headers bold, contact info on top. Our PDF-to-Word converter is tuned for resume layouts.",
    whatToKnow: [
      {
        title: "What converts cleanly",
        body: "Single-column resumes with section headers (Experience, Education, Skills): clean conversion. Two-column resumes with sidebars: usually clean, sometimes columns swap order. Bullet lists: preserved as bullet lists. Bold text: preserved. Italics: preserved.",
      },
      {
        title: "What needs cleanup",
        body: "Custom fonts (e.g., Calibri Light → substituted with closest match). Heavy graphic elements (full-width header bands, icon bullets). Photos: preserved as embedded images. Tables: preserved but cell merging may need fixing.",
      },
      {
        title: "ATS implications",
        body: "When you re-export the edited Word back to PDF, the result stays ATS-friendly as long as you didn't add tables or text boxes during editing. Most ATS systems prefer linear text — sections in order, top to bottom.",
      },
      {
        title: "When to start over instead",
        body: "If your PDF was originally a fancy designer resume (Canva, Figma, custom InDesign), the Word conversion will look messy. In that case, copy the text into a clean Word resume template — faster than fixing layout.",
      },
    ],
    steps: [
      { name: "Upload your resume PDF", text: "Drop the file. Resumes are usually under 1 MB." },
      { name: "Convert", text: "We extract text, headers, and bullets in reading order." },
      { name: "Open in Word", text: "Edit in Microsoft Word, Google Docs, or LibreOffice. Make changes." },
      { name: "Save back to PDF", text: "Export the edited Word doc back to PDF for your application." },
    ],
    tips: [
      "Open the converted Word doc in Google Docs (free) if you don't have Microsoft Word — formatting is preserved.",
      "Keep your resume to one page if you have <10 years experience, two pages for senior roles.",
      "Avoid adding tables or text boxes during editing — both can confuse ATS parsers.",
      "Re-export to PDF before applying — Word .docx is fine for some applications but PDF is universal.",
    ],
    faq: [
      {
        q: "Will the converted Word doc look identical to my PDF?",
        a: "Close, not exact. Custom fonts substitute. Layout is preserved for typical resume templates. Expect 2–3 minutes of cleanup.",
      },
      {
        q: "Will ATS still parse my resume after the round-trip?",
        a: "Yes — as long as text stays as text (it will, with our converter). Avoid adding tables / text boxes during your Word edit.",
      },
      {
        q: "What if my resume is a scan?",
        a: "Run OCR PDF first to extract the text, then convert the OCR'd PDF to Word.",
      },
      {
        q: "Can I edit it in Google Docs?",
        a: "Yes — .docx imports fully into Google Docs with all editable text and formatting.",
      },
      {
        q: "How do I keep my resume looking professional after editing?",
        a: "Use a single, common font (Calibri, Arial, Helvetica). Keep margins consistent. Don't add color or graphics that won't survive ATS conversion.",
      },
    ],
    related: ["merge-pdf-for-resume", "pdf-to-word-without-losing-formatting", "compress-pdf-for-upload"],
    ctaLabel: "Convert your resume to Word",
  },

  // OCR + convert combo
  {
    slug: "convert-scanned-pdf-to-word",
    parentToolSlug: "ocr-pdf",
    parentToolHref: "/tools/ocr-pdf",
    category: "OCR PDF",
    h1: "Convert Scanned PDF to Word — Editable Text via OCR",
    metaTitle: "Convert Scanned PDF to Word Free | OCR + Edit | MyPDFKitty",
    metaDescription:
      "Convert a scanned PDF (image-only) into an editable Word document via OCR. 25 languages supported, free in your browser.",
    intro:
      "Scanned PDFs are images of pages — there's no actual text inside, just pixels. Trying to convert one directly to Word produces a Word doc with image objects, not editable text. The fix is OCR (optical character recognition): turn the images of text into real text first, then convert. Both happen in the browser, no install.",
    whatToKnow: [
      {
        title: "How to tell if your PDF is scanned",
        body: "Open the PDF and try to select text with your cursor. If the cursor only selects whole pages (not individual letters), it's scanned. If you can highlight specific words, it's already text.",
      },
      {
        title: "OCR language matters",
        body: "Tesseract (the OCR engine) needs the right language model to read your document. We support 25 languages including English, Spanish, French, German, Chinese (Simplified + Traditional), Japanese, Korean, Arabic, Hindi, Russian, Portuguese, and more. Pick the language(s) your document is written in.",
      },
      {
        title: "Quality of the scan affects accuracy",
        body: "Clean, high-resolution scans (300 DPI) give 99%+ OCR accuracy. Phone-camera scans of paper can be messy (skew, lighting, fingers in frame) and drop to 90–95%. For best results, scan flat with good lighting or use a scanner app like Adobe Scan or CamScanner.",
      },
      {
        title: "Two-step process",
        body: "Step 1: OCR PDF turns the scan into a searchable PDF (image + invisible text layer). Step 2: PDF-to-Word converts that searchable PDF to .docx. Some users only need step 1 — a searchable PDF is editable in our editor and acceptable for most workflows.",
      },
    ],
    steps: [
      { name: "Upload the scanned PDF", text: "Drop your scan." },
      { name: "Pick OCR languages", text: "English by default. Add other languages if your document is multilingual." },
      { name: "Run OCR", text: "We extract text from each page and layer it onto the original (invisible to viewers but selectable and searchable)." },
      { name: "Convert to Word", text: "From the OCR'd PDF, run our PDF-to-Word converter to get an editable .docx." },
    ],
    tips: [
      "If your scan has multiple languages (English + Spanish, etc.), select both — Tesseract handles multilingual OCR well.",
      "For receipts, IDs, and forms with small text, scan at 300 DPI minimum. 600 DPI is overkill for most cases.",
      "If OCR misreads specific words consistently (a custom name, technical term), add a manual fix in Word after conversion.",
      "For sensitive scans (tax docs, IDs), consider redacting in our edit-pdf tool before OCR if you're sharing with others.",
    ],
    faq: [
      {
        q: "How accurate is the OCR?",
        a: "99%+ for clean printed text at 300 DPI, 90–95% for phone-camera scans. Handwriting accuracy is much lower (~70%) and depends heavily on the writer's clarity.",
      },
      {
        q: "Can I OCR a handwritten document?",
        a: "Tesseract supports handwriting recognition for printed-style handwriting (most clear adult handwriting). Cursive is harder. Expect 60–80% accuracy on neat handwriting, lower on messy.",
      },
      {
        q: "What languages do you support?",
        a: "25 languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Polish, Turkish, Arabic, Hindi, Bengali, Chinese (Simplified + Traditional), Japanese, Korean, Vietnamese, Thai, and more.",
      },
      {
        q: "Will the Word document look like the scan?",
        a: "Layout is approximated — paragraphs reflow into normal Word formatting. Headers and bullets are usually detected. Heavy graphic layouts (newspaper-style) may need manual cleanup.",
      },
      {
        q: "Can I OCR multi-page PDFs?",
        a: "Yes — OCR runs on every page. Free plan up to 25 MB; Pro plan up to 250 MB.",
      },
    ],
    related: ["pdf-to-word-without-losing-formatting", "pdf-to-word-resume", "redact-pdf"],
    ctaLabel: "OCR + convert your scan",
  },

  // Sign on Mac
  {
    slug: "sign-pdf-on-mac",
    parentToolSlug: "sign-pdf",
    parentToolHref: "/tools/sign-pdf",
    category: "Sign PDF",
    h1: "Sign a PDF on Mac — Faster Than Preview",
    metaTitle: "Sign PDF on Mac Free | Better Than Preview | MyPDFKitty",
    metaDescription:
      "Sign PDFs on Mac without Preview's quirks. Browser-based, draws on trackpad, works on macOS Sonoma, Sequoia, and any Mac with a modern browser.",
    intro:
      "macOS Preview has built-in PDF signing — it's fine for one-page personal stuff but it nags you to use Continuity Camera, sometimes saves signatures in places you don't want, and has limited control over signature placement. Our browser-based signer works in Safari, Chrome, or Firefox on any Mac, lets you draw with the trackpad or upload a saved signature image, and outputs a clean PDF without macOS-specific metadata.",
    whatToKnow: [
      {
        title: "Preview vs. our signer",
        body: "Preview: built-in, fastest for a one-off signature on a one-page PDF you're emailing back. Our signer: better for multi-page contracts, multiple fields per page, sending to others for signature, or sharing a signed PDF that doesn't reveal you're on macOS.",
      },
      {
        title: "Trackpad signatures work great",
        body: "Modern Mac trackpads have high pressure sensitivity, so finger or stylus drawing produces a natural-looking signature. Apple Pencil + iPad mirroring (Sidecar) gives you the cleanest signature possible.",
      },
      {
        title: "Continuity Camera for handwritten",
        body: "If you have an iPhone nearby, you can sign on paper, snap a photo via macOS Continuity Camera, and use that image as a signature. Save it once, reuse it anywhere.",
      },
      {
        title: "Privacy",
        body: "Files are uploaded to your private workspace, encrypted in transit and at rest, auto-deleted on free plans after processing. We don't read or store your signature image beyond the active session.",
      },
    ],
    steps: [
      { name: "Open in Safari/Chrome/Firefox", text: "Skip Preview — open mypdfkitty.com directly." },
      { name: "Upload your PDF", text: "Drop the contract or click to upload from Finder, iCloud Drive, or Desktop." },
      { name: "Sign", text: "Type, draw with the trackpad, or upload a signature image. Drag the signature onto the right page and resize." },
      { name: "Download", text: "Save the signed PDF — usually to Downloads. Drag into your reply email or send via Mail." },
    ],
    tips: [
      "Use your trackpad if you don't have a stylus — modern Mac trackpads are great for drawing.",
      "If you sign documents often, draw your signature once, take a screenshot of just the signature region, and save it as 'signature.png'. Reuse that image — every signature looks identical.",
      "Keep a small library of signatures (initials, full name, business name) in a 'Signatures' folder for quick reuse.",
      "For multi-page contracts that need initials on every page, drop initials fields on each page in our editor.",
    ],
    faq: [
      {
        q: "Why not just use Preview?",
        a: "For a one-off, Preview is fine. For multi-page contracts, multiple recipients, or reusable signatures across many documents, our tool is faster and gives you more control.",
      },
      {
        q: "Does it work on older Macs?",
        a: "Yes — works in any modern browser (Safari 15+, Chrome, Firefox) on macOS Mojave and later.",
      },
      {
        q: "Can I use Apple Pencil on Mac?",
        a: "Indirectly via Sidecar (mirror your Mac to iPad and use Pencil). Apple Pencil isn't natively supported on Mac trackpad/screen.",
      },
      {
        q: "Is the signed PDF the same legal weight as a Preview signature?",
        a: "Yes — both are standard electronic signatures under U.S. ESIGN Act. The signing tool doesn't affect legality.",
      },
      {
        q: "Where does the signed PDF go?",
        a: "Downloads folder by default. You can also save to iCloud Drive or any other location via the browser's save dialog.",
      },
    ],
    related: ["sign-pdf-on-iphone", "sign-pdf-nda", "send-nda-for-signature"],
    ctaLabel: "Sign your PDF on Mac",
  },

  // Sign on Android
  {
    slug: "sign-pdf-on-android",
    parentToolSlug: "sign-pdf",
    parentToolHref: "/tools/sign-pdf",
    category: "Sign PDF",
    h1: "Sign a PDF on Android — In Chrome, No App",
    metaTitle: "Sign PDF on Android Free | No App Install | MyPDFKitty",
    metaDescription:
      "Sign a PDF on Android without installing an app. Open in Chrome, draw with your finger, place the signature, download. Works on any Android phone or tablet.",
    intro:
      "Most Android PDF apps want a paid subscription, push ads, or require an account just to sign. Our browser-based signer works in Chrome on any Android phone or tablet, draws with your finger, and outputs a clean PDF — no install, no account, no in-app purchase modal. Open the page, upload, sign, download.",
    whatToKnow: [
      {
        title: "Works in Chrome (and other browsers)",
        body: "Chrome on Android handles PDFs and our signing canvas natively. Firefox, Brave, and Edge on Android also work. Samsung Internet works too with minor scrolling differences.",
      },
      {
        title: "Drawing with finger",
        body: "Touch sampling on modern Android (Pixel, Galaxy, OnePlus) is high enough that finger signatures look natural. For best results, hold the device landscape — wider canvas means more room for a flowing signature.",
      },
      {
        title: "Stylus support",
        body: "Samsung Galaxy Note / S Ultra users can use S-Pen for the cleanest signatures possible. Other styluses (third-party Bluetooth, capacitive) work too.",
      },
      {
        title: "Where the signed PDF lands",
        body: "Default Downloads folder. Open in Files app, share via Gmail / Drive / WhatsApp from there. Some browsers offer 'open with' options directly after download.",
      },
    ],
    steps: [
      { name: "Open Chrome", text: "Visit mypdfkitty.com in Chrome." },
      { name: "Upload your PDF", text: "Tap 'Choose PDF' and pick the file from Files, Drive, or Photos." },
      { name: "Sign with finger", text: "Tap the signature field, choose 'Draw', sign with your finger. Tap 'Type' if you'd rather type." },
      { name: "Download", text: "Save to Downloads, then share via your usual app (Gmail, Drive, WhatsApp)." },
    ],
    tips: [
      "Hold landscape — wider canvas, better signature.",
      "Use S-Pen if you have a Galaxy Note / S Ultra. Cleanest output.",
      "Disable autofill on the form field — Android sometimes pops up keyboard suggestions over the canvas.",
      "Save your signed PDF to Drive immediately; some download managers compress files on the way to Downloads, which can degrade the signature.",
    ],
    faq: [
      {
        q: "Do I need to install an app?",
        a: "No. Chrome (or any modern Android browser) handles everything.",
      },
      {
        q: "Will the signature look good?",
        a: "Yes — modern Android touch sampling is high enough for natural finger signatures. S-Pen gives the cleanest result.",
      },
      {
        q: "Can I sign multi-page contracts?",
        a: "Yes — flip pages and add signatures or initials wherever needed.",
      },
      {
        q: "Is it legally binding?",
        a: "Yes — same legal weight as desktop signing under U.S. ESIGN Act and EU eIDAS. Device doesn't matter.",
      },
      {
        q: "What if the PDF is in my Gmail?",
        a: "Tap the attachment to download to Files, then upload to our tool. Or tap-and-hold the attachment and pick 'Open in Chrome' if available.",
      },
    ],
    related: ["sign-pdf-on-iphone", "sign-pdf-nda", "send-nda-for-signature"],
    ctaLabel: "Sign your PDF on Android",
  },

  // Send rental agreement
  {
    slug: "send-rental-agreement-for-signature",
    parentToolSlug: "send-for-signature",
    parentToolHref: "/tools/send-for-signature",
    category: "Send for signature",
    h1: "Send a Rental Agreement for Signature — Landlords & Tenants",
    metaTitle: "Send Rental Agreement for Signature Free | Lease Online | MyPDFKitty",
    metaDescription:
      "Send a rental agreement (lease) to tenants for online e-signature. Free up to 10/month, audit trail included, both parties get the signed PDF.",
    intro:
      "Sending a rental agreement to a new tenant should not require driving to a printer, paying for postage, or buying a $30/month DocuSign subscription. Drop the lease PDF, add the tenant(s) and yourself, drag signature fields, send. Tenants sign in their browser (no account needed), the fully-signed lease lands in everyone's inbox with an audit trail. Free up to 10 signatures per month.",
    whatToKnow: [
      {
        title: "Lease basics every state requires",
        body: "Names of all tenants and landlord, property address, term length (start and end date), monthly rent, security deposit amount, payment due date, late-fee policy, lead-paint disclosure (federal, properties built before 1978), and signatures from all parties. State-specific addenda may apply (CA: bedbug disclosure; NY: lead-paint window guards; FL: radon disclosure).",
      },
      {
        title: "Both parties usually sign",
        body: "Add yourself (landlord) as a recipient and the tenant(s) as additional recipients. For shared housing, add every adult tenant — courts treat all named tenants as jointly liable.",
      },
      {
        title: "Co-signers and guarantors",
        body: "Some leases require a guarantor (parent for student tenant, etc.). Add them as a third recipient with their own signature field. The guarantor's signature line typically reads 'Guarantor' rather than 'Tenant'.",
      },
      {
        title: "Lease counts as a contract",
        body: "Same legal framework as any e-signed contract — U.S. ESIGN Act and state Uniform Electronic Transactions Acts. Standard electronic signatures are enforceable for residential leases in all 50 states except in narrow Vermont edge cases.",
      },
    ],
    steps: [
      { name: "Upload the lease PDF", text: "Drop your lease — your own template, a state-specific blank lease, or one from your property management software." },
      { name: "Add all parties", text: "You (landlord) + every adult tenant + any guarantors." },
      { name: "Place signature and initials", text: "Signature on each party's signature line. If the lease requires initials on every page, drop initials fields on each page for each signer." },
      { name: "Send", text: "Each party gets their private link. Track who's viewed and signed in your dashboard." },
    ],
    tips: [
      "Set the envelope subject to '[Property Address] Lease — [Tenant Name]' so it's findable later.",
      "Personal message: 'Hi Sarah, here's the lease for 123 Main St starting June 1. Standard 12-month terms — let me know if you have questions.'",
      "If the lease has a security deposit form, include it in the same envelope as a separate document or merged together.",
      "Save signed leases in cloud storage (Google Drive, Dropbox) named '[Property]_Lease_[Year]_[TenantLastName].pdf'.",
    ],
    faq: [
      {
        q: "Are e-signed leases legally binding?",
        a: "Yes in all 50 states. Standard electronic signatures under the federal ESIGN Act and state Uniform Electronic Transactions Acts are enforceable for residential leases.",
      },
      {
        q: "Do I need to print the signed lease?",
        a: "No. The signed PDF with audit certificate is the legal record. Save digital copies; print only if your local government requires a paper copy on file.",
      },
      {
        q: "What if the tenant won't sign electronically?",
        a: "Send them the PDF, have them print, sign, scan, and email back. Then use our edit-pdf tool to merge their signed page into your master copy. Or honor their preference and meet in person.",
      },
      {
        q: "Can I add multiple tenants to one envelope?",
        a: "Yes — up to 10 recipients. Each gets their own signing link and assigned signature fields.",
      },
      {
        q: "What about lease renewals?",
        a: "Send the renewal lease as a new envelope. Each renewal is its own contract with its own signed copy and audit trail.",
      },
    ],
    related: ["send-contract-for-signature", "send-nda-for-signature", "sign-pdf-nda"],
    ctaLabel: "Send your lease for signature",
  },

  // Send waiver
  {
    slug: "send-waiver-for-signature",
    parentToolSlug: "send-for-signature",
    parentToolHref: "/tools/send-for-signature",
    category: "Send for signature",
    h1: "Send a Waiver for Signature — Gyms, Sports, Events",
    metaTitle: "Send Waiver for Signature Free | Liability Release | MyPDFKitty",
    metaDescription:
      "Send liability waivers, release forms, and consent forms for online e-signature. Free up to 10/month — perfect for gyms, sports clubs, events, tours.",
    intro:
      "Liability waivers are the small business owner's best friend — they protect gyms, climbing walls, sports clubs, dance studios, tour operators, and event organizers from frivolous lawsuits. The hard part isn't writing the waiver; it's getting it signed before a participant walks in the door. Send the waiver via email, they sign in their browser, signed PDF lands in your inbox before they show up. No paper, no clipboard, no scanning.",
    whatToKnow: [
      {
        title: "What a waiver typically covers",
        body: "Acknowledgment of risks (specific to the activity), release of liability for the operator, indemnification (participant pays for their own injuries), assumption of risk by the participant, and an agreement to follow safety rules. Some include photo/video release as a bundled clause.",
      },
      {
        title: "Minor participants need parent/guardian signature",
        body: "Waivers signed by minors aren't enforceable. For under-18 participants, the parent or legal guardian must sign as the responsible party. Add the parent as the recipient (not the minor) and have the waiver describe the minor by name.",
      },
      {
        title: "Group waivers vs. individual",
        body: "For group activities (corporate retreat, sports league), send a separate envelope per participant — easier to track who hasn't signed and avoids one bad signature voiding the whole batch. For very large events, consider a kiosk-style intake instead.",
      },
      {
        title: "Where to store signed waivers",
        body: "Keep signed waivers for the duration of your activity's statute of limitations, typically 2–3 years post-activity in the U.S. (varies by state and activity type). Most operators keep waivers indefinitely.",
      },
    ],
    steps: [
      { name: "Upload your waiver", text: "Drop your standard waiver PDF (drafted by your lawyer or from your trade association template)." },
      { name: "Add the participant", text: "For minors, add the parent/guardian and reference the minor by name in the waiver." },
      { name: "Place fields", text: "Signature, date, and any required text fields (emergency contact, insurance info)." },
      { name: "Send", text: "Participant gets a private link. Sign before they show up." },
    ],
    tips: [
      "Pre-fill the activity date and location in the waiver before sending — saves time for the participant.",
      "Use a clear envelope subject: '[Event Name] Waiver — Please Sign Before [Date]'.",
      "Send waivers 24–48 hours before the activity. Day-of waivers leave you with no signature if the participant doesn't show.",
      "For repeat customers, save the signed waiver in their CRM record so you don't re-send for every visit.",
    ],
    faq: [
      {
        q: "Are e-signed waivers legally enforceable?",
        a: "Yes in most jurisdictions — same legal framework as any e-signed contract under U.S. ESIGN Act. Some courts give extra scrutiny to waivers (you can't waive certain rights like gross negligence), but the e-signature itself isn't the issue.",
      },
      {
        q: "Can a parent sign for a minor?",
        a: "Yes — parents/guardians can sign waivers on behalf of minor children for activities. The signed party is the parent, not the minor.",
      },
      {
        q: "What about photo/video release in the same waiver?",
        a: "Common — many activity waivers bundle photo/video release as a separate clause. We don't change that; it's part of your waiver document.",
      },
      {
        q: "How do I send waivers to a group of 50?",
        a: "Each waiver is its own envelope. Send 50 envelopes (or use our API when it ships in 2026 to script bulk sends). Free plan covers 10/month, Plus 50, Pro 200.",
      },
      {
        q: "Should I consult a lawyer about my waiver?",
        a: "Yes — waivers are state-specific and activity-specific. A trade association lawyer (e.g., for climbing gyms, IndoorSports Council) usually has battle-tested templates worth more than a generic online form.",
      },
    ],
    related: ["send-contract-for-signature", "send-rental-agreement-for-signature", "send-nda-for-signature"],
    ctaLabel: "Send your waiver for signature",
  },

  // Merge for loan application
  {
    slug: "merge-pdf-for-loan-application",
    parentToolSlug: "merge-pdf",
    parentToolHref: "/tools/merge-pdf",
    category: "Merge PDF",
    h1: "Merge PDF for Loan Application — Mortgage, Auto, Personal",
    metaTitle: "Merge PDF for Loan Application Free | Mortgage, Auto | MyPDFKitty",
    metaDescription:
      "Combine pay stubs, W-2s, bank statements, and ID into a single PDF for loan applications. Most lenders cap at 10–25 MB. Free in your browser.",
    intro:
      "Loan applications expect a packet — pay stubs, W-2s, tax returns, bank statements, government ID, sometimes a letter of explanation. Lenders almost always want this as a single PDF, not 12 separate attachments. Merging in the right order matters: lender systems often parse the first few pages for borrower info, so the cover letter and ID go first, financial documents next, supporting docs last. Compress after merging if the file's over 10 MB.",
    whatToKnow: [
      {
        title: "Standard order for mortgage applications",
        body: "Page 1: cover letter / completed application form. Pages 2–3: government ID (driver's license front + back). Pages 4+: most recent 2 pay stubs, last 2 years' W-2s, last 2 months' bank statements, last 2 years' tax returns. Letters of explanation last.",
      },
      {
        title: "Lender file size caps",
        body: "Most major lenders (Chase, Wells Fargo, Quicken/Rocket): 10–25 MB. Most online lenders (SoFi, Lightstream, LendingClub): 5–10 MB. Local credit unions: often tighter, 5 MB. Compress aggressively after merging.",
      },
      {
        title: "Don't merge separate borrower applications",
        body: "If you and a co-borrower are both applying, each typically submits a separate packet. Don't merge spouse's documents into yours unless the lender explicitly asks for a combined file.",
      },
      {
        title: "Privacy considerations",
        body: "Loan packets contain SSNs, account numbers, and ID images. Use a private workspace (paid plan) so files aren't auto-deleted and you can re-download if the lender loses them. Never email the packet over an unencrypted channel.",
      },
    ],
    steps: [
      { name: "Drop documents in order", text: "Cover letter / app form first, ID next, pay stubs, W-2s, bank statements, tax returns, supporting docs last." },
      { name: "Reorder if needed", text: "Drag thumbnails to swap positions. Remove duplicates or extra pages." },
      { name: "Merge", text: "Single PDF with everything in lender-expected order." },
      { name: "Compress for upload", text: "Most loan portals cap at 10 MB. Run compress-pdf-for-upload after merging if needed." },
    ],
    tips: [
      "Name the merged file '[YourLastName]_Loan_Application_[Date].pdf' so the loan officer can identify it without opening.",
      "Black out account numbers on bank statements EXCEPT the last 4 digits — most lenders only need the last 4 to verify the account.",
      "If your packet exceeds the lender's cap after compression, split into 'Application' and 'Supporting Documents' and upload separately.",
      "Keep the merged packet for your records. Loan officers sometimes lose docs during processing.",
    ],
    faq: [
      {
        q: "What's the standard loan packet file size?",
        a: "Most packets are 5–15 MB. Bank statements with images bloat the file. If yours is over 25 MB, you have very high-res scans — compress aggressively.",
      },
      {
        q: "Should I include both sides of my driver's license?",
        a: "Yes — most lenders want both sides. Front + back as two separate pages or one combined page.",
      },
      {
        q: "What about my co-borrower's docs?",
        a: "Usually separate packets. Some lenders ask for a combined household packet — follow their specific instructions.",
      },
      {
        q: "Can I redact account numbers?",
        a: "Lenders need to verify accounts — don't redact account numbers, only consider redacting the rest of the digits except the last 4. Use our redact-pdf tool.",
      },
      {
        q: "How do I send a packet over 25 MB?",
        a: "Compress first. If still too big, the lender's portal usually has a way to split-upload. Or upload to their secure document portal (most have one).",
      },
    ],
    related: ["merge-pdf-for-resume", "compress-pdf-for-upload", "redact-pdf"],
    ctaLabel: "Merge your loan application",
  },

  // PDF to JPG high quality
  {
    slug: "pdf-to-jpg-high-quality",
    parentToolSlug: "pdf-to-jpg",
    parentToolHref: "/tools/pdf-to-jpg",
    category: "PDF to JPG",
    h1: "Convert PDF to JPG (High Quality) — 300 DPI",
    metaTitle: "Convert PDF to JPG High Quality 300 DPI Free | MyPDFKitty",
    metaDescription:
      "Convert PDF pages to high-quality JPG images at 300 DPI — print-ready resolution for social media, presentations, and design work. Free.",
    intro:
      "Most PDF-to-JPG converters spit out 72 DPI thumbnails — fine for screen viewing, useless for printing or zooming. Our converter renders pages at 300 DPI by default (print-ready) and lets you push to 600 DPI for high-detail work like architectural drawings or photo portfolios. Pick the resolution, pick which pages, get sharp JPGs ready for Instagram, Keynote, or your design comp.",
    whatToKnow: [
      {
        title: "What 300 DPI means in practice",
        body: "DPI = dots per inch. A US Letter page (8.5×11\") at 300 DPI is 2,550 × 3,300 pixels — sharp on phones, tablets, laptops, and standard prints up to 8×10. At 600 DPI it's 5,100 × 6,600 — magazine and book printing quality.",
      },
      {
        title: "When to use JPG vs. PNG",
        body: "JPG: photos, color illustrations, anything with gradients. Smaller files, lossy compression. PNG: text-heavy pages, line art, screenshots, transparency. Larger files, lossless. For PDF pages with both, JPG is usually fine.",
      },
      {
        title: "File size at different DPIs",
        body: "Same Letter-size page: 72 DPI ≈ 50 KB · 150 DPI ≈ 200 KB · 300 DPI ≈ 800 KB · 600 DPI ≈ 3 MB. A 100-page PDF at 600 DPI becomes 300 MB of JPGs — pick resolution accordingly.",
      },
      {
        title: "Color profiles",
        body: "Output is sRGB JPG, which is the right color space for screens, web, and most consumer printing. For commercial print (CMYK) you'll need to color-convert in Photoshop after — JPG is RGB by definition.",
      },
    ],
    steps: [
      { name: "Upload your PDF", text: "Drop the PDF you want to convert." },
      { name: "Pick resolution", text: "300 DPI for most uses. 600 DPI for high-detail printing or zooming. 150 DPI for small file sizes." },
      { name: "Pick pages", text: "All pages, a range, or specific pages." },
      { name: "Download as ZIP", text: "Multiple JPGs come zipped. Single page comes as a single .jpg file." },
    ],
    tips: [
      "For Instagram posts, 1080×1080 px at any DPI is fine — they re-encode. For grid posts, export at 300 DPI then crop in Photoshop.",
      "For Keynote / PowerPoint, 150 DPI is usually plenty unless you're zooming. Saves on file size.",
      "For blog featured images, 1200×630 at 72–150 DPI is standard. Save bandwidth.",
      "Always keep the source PDF — JPG is lossy and you can't go back to vector quality.",
    ],
    faq: [
      {
        q: "What's the highest resolution I can export?",
        a: "600 DPI on free, up to 1200 DPI on Pro. For most purposes 300 DPI is plenty.",
      },
      {
        q: "Can I export specific pages only?",
        a: "Yes — pick a single page, a range (5–10), or non-contiguous pages (1, 3, 5).",
      },
      {
        q: "Does it preserve the original page size?",
        a: "Yes — a Letter-size page stays Letter-size at the chosen DPI. A4 stays A4. Custom sizes are preserved.",
      },
      {
        q: "Why are my JPG files so big?",
        a: "Probably exporting at 600 DPI when you need 300. Lower the DPI and re-export.",
      },
      {
        q: "Can I batch-convert multiple PDFs?",
        a: "Pro and Business plans support batch processing. Free and Plus convert one PDF at a time.",
      },
    ],
    related: ["compress-pdf-for-email", "pdf-to-word-without-losing-formatting", "merge-pdf-for-portfolio"],
    ctaLabel: "Convert your PDF to high-quality JPG",
  },
];

export function findUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}

export function relatedUseCases(slugs: string[]): UseCase[] {
  return slugs.map(findUseCase).filter((u): u is UseCase => Boolean(u));
}
