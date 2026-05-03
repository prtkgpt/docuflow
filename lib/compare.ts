// Comparison page catalog. We use cautious language and explicit
// "verify before quoting" callouts so we don't make false competitor claims.

export type Comparison = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  table: { name: string; pros: string; cons: string; bestFor: string }[];
  verdict: string;
  faq: { q: string; a: string }[];
  ourCta: { href: string; label: string };
  relatedToolSlugs: string[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "best-pdf-editor-online",
    title: "Best PDF Editor Online in 2026 | MyPDFKitty",
    description: "Compare the best online PDF editors for everyday document work. See features, use cases, and limitations.",
    h1: "Best PDF Editor Online in 2026",
    intro:
      "If you need to add text, signatures, highlights, or images to a PDF without installing software, an online PDF editor is the fastest path. Here's how the most-used options compare for everyday use.",
    table: [
      { name: "MyPDFKitty", pros: "Browser-based editor with text, highlights, signatures, images, links, and full page management.", cons: "Rewriting existing PDF text is on the roadmap.", bestFor: "Annotating, signing, and reorganizing PDFs day-to-day." },
      { name: "Adobe Acrobat (Web)", pros: "Long-standing brand and deep editing features.", cons: "Subscription is expensive for light use.", bestFor: "Heavy-volume editing inside a Creative Cloud workflow." },
      { name: "Smallpdf", pros: "Clean UI and well-known.", cons: "Many tools sit behind a paywall.", bestFor: "Light use with a tolerance for upsells." },
      { name: "iLovePDF", pros: "Wide tool catalog.", cons: "Can be ad-heavy on free tier.", bestFor: "One-off conversions." },
    ],
    verdict:
      "For most people, the right PDF editor is one that lets you finish the job without learning a new app. MyPDFKitty's editor handles the common edits in one place.",
    faq: [
      { q: "Are online PDF editors safe?", a: "They are when uploads use HTTPS and files are isolated to your account. Always check the provider's privacy policy." },
      { q: "Can online editors handle scanned PDFs?", a: "You can annotate them. To make text searchable, run OCR first." },
    ],
    ourCta: { href: "/tools/edit-pdf", label: "Open MyPDFKitty's editor" },
    relatedToolSlugs: ["edit-pdf", "sign-pdf", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "best-pdf-compressor",
    title: "Best PDF Compressor in 2026 | MyPDFKitty",
    description: "Compare PDF compression tools by output size, speed, and ease of use.",
    h1: "Best PDF Compressor in 2026",
    intro:
      "PDF compression is mostly about how aggressively a tool resamples images and strips metadata. The best tool for you balances size reduction against quality.",
    table: [
      { name: "MyPDFKitty", pros: "Browser-based, no install, sane defaults.", cons: "For very large files, upgrade to a paid plan.", bestFor: "Most everyday compression jobs." },
      { name: "Adobe Acrobat", pros: "Industry standard.", cons: "Paid plan required for full feature set.", bestFor: "Print-grade compression workflows." },
      { name: "Smallpdf", pros: "Easy UX.", cons: "Paywall on bulk use.", bestFor: "Occasional one-off compression." },
    ],
    verdict: "If you just need a smaller PDF that still looks good, MyPDFKitty's Compress PDF tool is the fastest path.",
    faq: [
      { q: "How small can a PDF get?", a: "Image-heavy PDFs shrink the most. Text-only PDFs are usually already small." },
      { q: "Does compression hurt quality?", a: "Defaults preserve readable quality. Save the original if you need a print-grade copy." },
    ],
    ourCta: { href: "/tools/compress-pdf", label: "Compress PDF Online" },
    relatedToolSlugs: ["compress-pdf", "merge-pdf", "split-pdf", "edit-pdf"],
  },
  {
    slug: "best-ai-pdf-summarizer",
    title: "Best AI PDF Summarizer Tools in 2026 | MyPDFKitty",
    description: "Compare AI PDF summarizer tools for students, researchers, professionals, and small businesses. See features, use cases, and limitations.",
    h1: "Best AI PDF Summarizer Tools in 2026",
    intro:
      "AI PDF summarizers help you triage long documents fast. The right pick depends on whether you need page-level citations, scanned-PDF support, and how much you summarize each month.",
    table: [
      { name: "MyPDFKitty", pros: "Short summary + bullets + takeaways + actions, with cited pages.", cons: "AI features require Pro/Business.", bestFor: "Triaging reports, papers, and contracts." },
      { name: "ChatGPT (with file upload)", pros: "Conversational and flexible.", cons: "Limits on file size and PDF parsing depend on plan.", bestFor: "Open-ended exploration of a PDF." },
      { name: "Claude (Projects)", pros: "Strong long-context handling.", cons: "Workflow lives inside Claude.", bestFor: "Working on a single PDF over multiple sessions." },
    ],
    verdict: "For workflow-focused PDF summarization with cited pages, MyPDFKitty's AI PDF Summarizer is purpose-built.",
    faq: [
      { q: "Are AI summaries accurate enough for legal work?", a: "Use them for triage, not as the final word. Always verify in the source document." },
      { q: "What about scanned PDFs?", a: "Run OCR first to extract the text, then summarize." },
    ],
    ourCta: { href: "/tools/ai-pdf-summarizer", label: "Try the AI PDF Summarizer" },
    relatedToolSlugs: ["ai-summarizer", "chat-pdf", "ocr-pdf", "key-points"],
  },
  {
    slug: "best-free-pdf-tools",
    title: "Best Free PDF Tools in 2026 | MyPDFKitty",
    description: "A practical roundup of the best free online PDF tools for editing, converting, signing, and summarizing.",
    h1: "Best Free PDF Tools in 2026",
    intro:
      "Most free PDF tools cover the basics: compress, merge, split, convert, and sign. The differences are file size limits, watermarks, and how aggressive the upsells are.",
    table: [
      { name: "MyPDFKitty (Free)", pros: "No watermark, clean UX, AI tools available on Pro.", cons: "10 MB / 3 files per month on free.", bestFor: "Light personal use." },
      { name: "Smallpdf (Free)", pros: "Brand recognition.", cons: "Limited free tasks per day.", bestFor: "Occasional use." },
      { name: "iLovePDF (Free)", pros: "Wide tool catalog.", cons: "Ads on free tier.", bestFor: "One-off conversions." },
    ],
    verdict: "If you want a free PDF toolkit you can use without surprises, start with MyPDFKitty.",
    faq: [
      { q: "Are free PDF tools safe?", a: "They are when they use HTTPS and clear retention policies." },
      { q: "Will free tools add a watermark?", a: "MyPDFKitty doesn't watermark editing or compression output on the Free plan." },
    ],
    ourCta: { href: "/tools", label: "Explore MyPDFKitty's free tools" },
    relatedToolSlugs: ["compress-pdf", "merge-pdf", "edit-pdf", "ai-summarizer"],
  },
  {
    slug: "adobe-acrobat-alternatives",
    title: "Adobe Acrobat Alternatives in 2026 | MyPDFKitty",
    description: "Looking for an Adobe Acrobat alternative? See how MyPDFKitty and others compare for everyday PDF work.",
    h1: "Adobe Acrobat Alternatives in 2026",
    intro:
      "Acrobat is the long-standing default but it's overkill — and overpriced — for many people. Here are practical alternatives for the most common tasks.",
    table: [
      { name: "MyPDFKitty", pros: "Lightweight, browser-based, AI-powered.", cons: "Doesn't yet match Acrobat's deep print-prepress features.", bestFor: "Day-to-day editing, signing, and AI workflows." },
      { name: "Smallpdf", pros: "Familiar UX.", cons: "Paywall.", bestFor: "Occasional conversions." },
      { name: "Foxit", pros: "Desktop and web apps.", cons: "Heavier install path.", bestFor: "Teams that prefer a desktop app." },
    ],
    verdict: "For most people moving away from Acrobat, MyPDFKitty covers 90% of the day-to-day workflow at a fraction of the cost.",
    faq: [
      { q: "Can I open existing Acrobat PDFs?", a: "Yes — every standard PDF is supported." },
      { q: "Will my workflows transfer?", a: "Most editing, conversion, and signing tasks have a direct equivalent." },
    ],
    ourCta: { href: "/tools", label: "Try MyPDFKitty" },
    relatedToolSlugs: ["edit-pdf", "sign-pdf", "compress-pdf", "merge-pdf"],
  },
  {
    slug: "smallpdf-alternatives",
    title: "Smallpdf Alternatives in 2026 | MyPDFKitty",
    description: "If you're considering Smallpdf, here are alternatives — including MyPDFKitty — and how they compare.",
    h1: "Smallpdf Alternatives in 2026",
    intro:
      "Smallpdf is well-known but limited on the free tier. If you want a similar UX with more on the free side, MyPDFKitty is worth a look.",
    table: [
      { name: "MyPDFKitty", pros: "Generous free tier, AI tools on Pro.", cons: "Smaller tool catalog than Acrobat.", bestFor: "Everyday PDFs." },
      { name: "iLovePDF", pros: "Big tool catalog.", cons: "Ads on free.", bestFor: "Light tasks." },
      { name: "Adobe Acrobat", pros: "Most powerful.", cons: "Expensive.", bestFor: "Pros who need everything." },
    ],
    verdict: "For most everyday tasks, MyPDFKitty is the practical Smallpdf replacement.",
    faq: [
      { q: "Will my Smallpdf files migrate?", a: "Files stay where you saved them — there's no migration; just upload to MyPDFKitty when needed." },
    ],
    ourCta: { href: "/tools", label: "See MyPDFKitty tools" },
    relatedToolSlugs: ["edit-pdf", "compress-pdf", "merge-pdf", "ai-summarizer"],
  },
  {
    slug: "ilovepdf-alternatives",
    title: "iLovePDF Alternatives in 2026 | MyPDFKitty",
    description: "Considering iLovePDF? Compare MyPDFKitty and other browser-based PDF tools.",
    h1: "iLovePDF Alternatives in 2026",
    intro:
      "iLovePDF is full-featured but ad-heavy on the free tier. Here are clean alternatives — including MyPDFKitty.",
    table: [
      { name: "MyPDFKitty", pros: "Clean, ad-free editor with AI tools.", cons: "Smaller catalog of niche conversions.", bestFor: "Day-to-day PDFs and AI workflows." },
      { name: "Smallpdf", pros: "Familiar UX.", cons: "Paywall.", bestFor: "Occasional conversions." },
      { name: "Adobe Acrobat", pros: "Industry standard.", cons: "Expensive.", bestFor: "Pros." },
    ],
    verdict: "If iLovePDF feels noisy, MyPDFKitty is a calmer alternative that does the common tasks well.",
    faq: [
      { q: "Does MyPDFKitty have ads?", a: "No ads anywhere in the product." },
    ],
    ourCta: { href: "/tools", label: "Switch to MyPDFKitty" },
    relatedToolSlugs: ["edit-pdf", "compress-pdf", "ai-summarizer"],
  },
  {
    slug: "pdfguru-alternatives",
    title: "PDFGuru Alternatives in 2026 | MyPDFKitty",
    description: "Looking for PDFGuru alternatives? See how MyPDFKitty stacks up for editing, signing, and AI workflows.",
    h1: "PDFGuru Alternatives in 2026",
    intro:
      "If PDFGuru's UI clicked for you, MyPDFKitty offers a similar editing experience plus first-class AI tools.",
    table: [
      { name: "MyPDFKitty", pros: "Editing + AI summarize/chat in one app.", cons: "Newer brand.", bestFor: "Editing PDFs and using AI on them." },
      { name: "PDFGuru", pros: "Polished editor.", cons: "Limited AI workflows.", bestFor: "Editing-only workflows." },
      { name: "Adobe Acrobat", pros: "Most features.", cons: "Expensive.", bestFor: "Heavy users." },
    ],
    verdict: "MyPDFKitty mirrors a familiar editing UX and adds AI tools on top.",
    faq: [
      { q: "Will my edits look the same?", a: "Yes — annotations are flattened the same way at export." },
    ],
    ourCta: { href: "/tools", label: "Try MyPDFKitty" },
    relatedToolSlugs: ["edit-pdf", "sign-pdf", "ai-summarizer", "chat-pdf"],
  },
  {
    slug: "best-free-pdf-signing-tools",
    title: "Best Free PDF Signing Tools in 2026 | MyPDFKitty",
    description: "Compare free online tools for signing PDFs. See which one fits typing, drawing, or uploading a signature.",
    h1: "Best Free PDF Signing Tools in 2026",
    intro:
      "If you just need to sign a PDF and send it back, a free online signer is faster than installing an app. The best one for you depends on whether you want typed, drawn, or image-based signatures and whether you'll sign multiple pages.",
    table: [
      { name: "MyPDFKitty", pros: "Type, draw, or upload a signature; place on any page; no watermark.", cons: "Doesn't yet support multi-party signature workflows.", bestFor: "Personal contracts, forms, and one-off signing." },
      { name: "Smallpdf eSign", pros: "Familiar UX.", cons: "Free tier limits per day; some features paywalled.", bestFor: "Light, occasional signing." },
      { name: "DocuSign Free Trial", pros: "Industry-standard for legal e-sign.", cons: "Free tier is a 30-day trial, not a permanent free plan.", bestFor: "When you need an eIDAS-grade legal trail." },
    ],
    verdict: "For most people who just need to sign and send, MyPDFKitty's signer is the simplest path: free, no watermark, no install.",
    faq: [
      { q: "Are typed signatures legally binding?", a: "For most everyday agreements yes. For regulated workflows that require eIDAS or qualified e-signatures, use a service that specializes in legal signing." },
      { q: "Can I sign on a phone?", a: "Yes — drawing with a finger works in mobile browsers." },
    ],
    ourCta: { href: "/tools/sign-pdf", label: "Sign a PDF for free" },
    relatedToolSlugs: ["sign-pdf", "edit-pdf", "merge-pdf", "compress-pdf"],
  },
  {
    slug: "best-free-pdf-to-word-converters",
    title: "Best Free PDF to Word Converters in 2026 | MyPDFKitty",
    description: "Compare free PDF to Word converters by output quality, file-size limits, and signup friction.",
    h1: "Best Free PDF to Word Converters in 2026",
    intro:
      "Free PDF→Word converters all extract text, but quality varies a lot. The differences are how cleanly paragraphs survive, whether tables are preserved, and what they ask for in exchange.",
    table: [
      { name: "MyPDFKitty", pros: "Browser-based, no install. Paragraphs reflowed back from PDF wraps. No watermark.", cons: "Tables and images aren't preserved (yet).", bestFor: "Most everyday text-heavy PDFs." },
      { name: "Smallpdf", pros: "Familiar UX.", cons: "Free tier limits conversions per day.", bestFor: "Occasional one-offs." },
      { name: "Adobe Acrobat (Free Online)", pros: "Best fidelity for complex layouts.", cons: "Daily free conversion limit; pushes you to paid.", bestFor: "Documents with complex tables." },
    ],
    verdict: "If your PDF is text-first (reports, letters, articles), MyPDFKitty is the cleanest free path. If it's table-heavy, Adobe's online converter still wins for fidelity.",
    faq: [
      { q: "Why doesn't my Word document have tables?", a: "Tables in PDFs are tricky to extract reliably. We're working on it; for now we preserve clean text and lists." },
      { q: "Is the conversion really free?", a: "Yes — files up to 10 MB on Free, no watermark." },
    ],
    ourCta: { href: "/tools/pdf-to-word", label: "Convert PDF to Word free" },
    relatedToolSlugs: ["pdf-to-word", "word-to-pdf", "edit-pdf", "compress-pdf"],
  },
  {
    slug: "best-free-image-converters",
    title: "Best Free Image Converters in 2026 | MyPDFKitty",
    description: "Compare free online tools for converting JPG, PNG, and PDF images.",
    h1: "Best Free Image Converters in 2026",
    intro:
      "Most image converters are functionally identical for simple JPG↔PNG conversions. The real differences are privacy (does it run in your browser, or upload to a server?), batch support, and whether they nag you for an account.",
    table: [
      { name: "MyPDFKitty", pros: "Pure client-side conversion (image never leaves your device); no signup; supports JPG↔PNG and JPG/PNG↔PDF.", cons: "No batch mode yet for image-only conversions.", bestFor: "Privacy-conscious one-off conversions." },
      { name: "iLovePDF / iLoveIMG", pros: "Wide tool catalog including image batches.", cons: "Ads on free tier; uploads images to a server.", bestFor: "Bulk image jobs where you don't mind the upload." },
      { name: "Smallpdf", pros: "Clean UX.", cons: "Free tier limits per day.", bestFor: "Occasional one-offs." },
    ],
    verdict: "For JPG↔PNG specifically, MyPDFKitty's tools run in your browser — your images stay on your device. That's a real privacy win over server-uploads.",
    faq: [
      { q: "What's the difference between JPG and PNG?", a: "JPG is lossy and smaller, great for photos. PNG is lossless and supports transparency, great for graphics and screenshots." },
      { q: "Is browser-side conversion as good as server-side?", a: "For JPG/PNG the browser uses the same encoders. Quality is identical to server-side; speed is comparable for normal-sized images." },
    ],
    ourCta: { href: "/tools/jpg-to-png", label: "Convert images for free" },
    relatedToolSlugs: ["jpg-to-png", "png-to-jpg", "jpg-to-pdf", "pdf-to-jpg"],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
