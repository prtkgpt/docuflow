// Static blog catalog. New posts added via /master-admin CMS land in the
// `BlogPost` Prisma table; the public blog routes merge both sources.

export type BlogPostBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; text: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: "PDF editing" | "PDF conversion" | "AI PDF" | "Business documents" | "Student PDFs";
  publishedAt: string;
  updatedAt?: string;
  primaryToolHref: string;
  primaryToolLabel: string;
  relatedToolSlugs: string[];
  relatedPostSlug?: string;
  faq: { q: string; a: string }[];
  // Direct answer in 2–4 sentences (LLM-friendly).
  answer: string;
  // Body blocks rendered server-side.
  body: BlogPostBlock[];
  howToSteps?: { name: string; text: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-compress-a-pdf-online",
    title: "How to Compress a PDF Online",
    description:
      "Learn how to compress a PDF online, reduce file size, and make PDFs easier to email or upload using MyPDFKitty.",
    category: "PDF editing",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/compress-pdf",
    primaryToolLabel: "Compress PDF Online",
    relatedToolSlugs: ["merge-pdf", "split-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-compress-a-pdf-for-email",
    answer:
      "You can compress a PDF online by uploading the file to a PDF compressor, choosing a compression level, and downloading the smaller file. MyPDFKitty helps reduce PDF file size for email, applications, forms, and document sharing — all in your browser.",
    howToSteps: [
      { name: "Open the compressor", text: "Go to MyPDFKitty's Compress PDF tool." },
      { name: "Upload your PDF", text: "Drag your PDF onto the upload box or browse to select it." },
      { name: "Wait for the optimization", text: "MyPDFKitty rebuilds the file with smaller assets." },
      { name: "Download the smaller PDF", text: "Save the compressed file and use it for email or uploads." },
    ],
    body: [
      { type: "h2", text: "Why compress a PDF?" },
      { type: "p", text: "Most PDFs balloon because of high-resolution images, fonts that aren't subset, or extra metadata. Compressing rebuilds the file so it's easier to email, faster to upload, and cheaper to store." },
      { type: "h2", text: "Step-by-step" },
      { type: "ol", items: [
        "Open the Compress PDF tool.",
        "Drop your file (or browse to select).",
        "Wait a few seconds while MyPDFKitty optimizes the file.",
        "Download and use the smaller PDF.",
      ] },
      { type: "h2", text: "Tips for the best result" },
      { type: "ul", items: [
        "Image-heavy PDFs compress more than plain text PDFs.",
        "If you're emailing, target a final size under 10 MB.",
        "For ATS or government portals, target 5 MB or less.",
        "Need to drop a few pages? Use Split PDF first.",
      ] },
      { type: "h2", text: "Common problems" },
      { type: "p", text: "If your file barely shrank, it's probably a scanned PDF — those are essentially packs of images. Either run OCR first, or split out the heaviest pages and re-export them as JPGs at lower resolution before merging again." },
    ],
    faq: [
      { q: "Will compression lower the quality?", a: "Most documents stay visually identical. For high-fidelity print files, keep the original and use the smaller copy only for sharing." },
      { q: "Is there a file size limit?", a: "Free accounts compress up to 10 MB; Pro raises this to 100 MB." },
      { q: "Are my files private?", a: "Yes. Files are uploaded over HTTPS and isolated to your account. Delete them from your dashboard at any time." },
    ],
  },
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files Online",
    description: "Combine multiple PDFs into one in your browser. A simple step-by-step guide using MyPDFKitty.",
    category: "PDF editing",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/merge-pdf",
    primaryToolLabel: "Merge PDF Online",
    relatedToolSlugs: ["split-pdf", "compress-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-split-a-pdf",
    answer:
      "To merge PDFs online, upload two or more PDFs to MyPDFKitty's Merge tool, drag them into the order you want, and download a single combined PDF. It works in your browser — no install needed.",
    howToSteps: [
      { name: "Open Merge PDF", text: "Go to MyPDFKitty's Merge PDF tool." },
      { name: "Upload multiple PDFs", text: "Drop two or more PDFs together onto the upload box." },
      { name: "Reorder pages", text: "Open Manage Pages in the editor to drag pages into the right order." },
      { name: "Download the merged PDF", text: "Save one combined PDF you can email or share." },
    ],
    body: [
      { type: "h2", text: "When to merge PDFs" },
      { type: "ul", items: [
        "Combining receipts into one expense report.",
        "Sending a single PDF to a client instead of three.",
        "Merging a cover letter and resume.",
        "Putting multi-part scans back together.",
      ] },
      { type: "h2", text: "Step-by-step" },
      { type: "ol", items: [
        "Open Merge PDF.",
        "Drop two or more PDFs on the upload box.",
        "Drag the page thumbnails to set the order.",
        "Click Done & Download to save the combined file.",
      ] },
    ],
    faq: [
      { q: "Is there a watermark?", a: "No. Merged PDFs are clean." },
      { q: "Can I merge images and PDFs together?", a: "Yes — convert your images to a PDF first using JPG to PDF, then merge with the rest." },
    ],
  },
  {
    slug: "how-to-split-a-pdf",
    title: "How to Split a PDF Online",
    description: "Extract specific pages or split a PDF into multiple files online with MyPDFKitty.",
    category: "PDF editing",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/split-pdf",
    primaryToolLabel: "Split PDF Online",
    relatedToolSlugs: ["merge-pdf", "compress-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-merge-pdf-files",
    answer:
      "To split a PDF online, upload the file to MyPDFKitty's Split tool, type the pages or ranges you want (for example 1-3, 5, 8-10), and download a smaller PDF with just those pages.",
    howToSteps: [
      { name: "Open Split PDF", text: "Go to MyPDFKitty's Split PDF tool." },
      { name: "Upload the PDF", text: "Drop a single PDF onto the upload box." },
      { name: "Pick the pages", text: "Type ranges like 1-3, 5, 8-10." },
      { name: "Download", text: "Save the new PDF that contains only those pages." },
    ],
    body: [
      { type: "p", text: "Splitting is the fastest way to share just the part of a PDF that someone needs — a single chapter, a specific section of a contract, or a page or two from a long report." },
      { type: "h2", text: "Common reasons to split" },
      { type: "ul", items: [
        "Extracting one section of a long ebook.",
        "Splitting a multi-form PDF into individual files.",
        "Sending one section of a contract.",
        "Removing duplicate scanned pages.",
      ] },
    ],
    faq: [
      { q: "How do I extract just one page?", a: "Type the page number (e.g. 5) in Split PDF to get a single-page PDF." },
      { q: "Can I split into multiple files at once?", a: "Yes — run Split with different ranges to create separate PDFs." },
    ],
  },
  {
    slug: "how-to-edit-a-pdf-online",
    title: "How to Edit a PDF Online",
    description: "Add text, signatures, images, notes and highlights to PDFs in your browser using MyPDFKitty.",
    category: "PDF editing",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/edit-pdf",
    primaryToolLabel: "Edit PDF Online",
    relatedToolSlugs: ["sign-pdf", "merge-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-sign-a-pdf-online",
    answer:
      "To edit a PDF online, upload it to MyPDFKitty's editor, then add text, highlights, images, signatures or notes from the toolbar. Click Done to download a flat PDF with your edits saved.",
    howToSteps: [
      { name: "Upload the PDF", text: "Drop your PDF in the editor." },
      { name: "Pick a tool", text: "Use Add Text, Highlight, Image, Sign, or Note from the toolbar." },
      { name: "Drag and resize", text: "Move and resize each annotation directly on the page." },
      { name: "Save", text: "Click Done and download a flat PDF." },
    ],
    body: [
      { type: "p", text: "MyPDFKitty's editor is built for everyday document work: filling out forms that aren't really fillable, leaving notes on a contract, adding a logo to a letter, or rearranging pages." },
      { type: "h2", text: "What you can do in the editor" },
      { type: "ul", items: [
        "Add text in any font, size, weight, and alignment.",
        "Highlight, underline, or draw on any page.",
        "Add typed, drawn, or uploaded signatures.",
        "Insert images and resize them.",
        "Reorder, rotate, or delete pages.",
        "Add real clickable hyperlinks.",
      ] },
    ],
    faq: [
      { q: "Can I edit existing text?", a: "You can add new text and shapes today. Rewriting original PDF text is on the roadmap." },
      { q: "Can I edit a scanned PDF?", a: "Yes — annotate any PDF. Run OCR first if you want to make scanned text searchable." },
    ],
  },
  {
    slug: "how-to-sign-a-pdf-online",
    title: "How to Sign a PDF Online",
    description: "Sign a PDF in your browser by typing, drawing, or uploading your signature with MyPDFKitty.",
    category: "PDF editing",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/sign-pdf",
    primaryToolLabel: "Sign PDF Online",
    relatedToolSlugs: ["edit-pdf", "merge-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-edit-a-pdf-online",
    answer:
      "To sign a PDF online, upload your file to MyPDFKitty, click the Sign tool, then type, draw, or upload your signature. Place it on the right page and download a signed PDF.",
    howToSteps: [
      { name: "Upload the PDF", text: "Drop the contract, form, or letter you need to sign." },
      { name: "Open the Sign tool", text: "Click Sign in the editor toolbar." },
      { name: "Create your signature", text: "Type your name, draw on the canvas, or upload an image." },
      { name: "Place and save", text: "Drag the signature onto the right page and click Done." },
    ],
    body: [
      { type: "p", text: "Most personal and small-business agreements accept typed or drawn electronic signatures. For workflows that require eIDAS or qualified signatures, use a dedicated e-signature service." },
    ],
    faq: [
      { q: "Are typed signatures legal?", a: "For most everyday agreements yes; for regulated workflows (banking, real estate in some jurisdictions) consult a qualified e-signature provider." },
      { q: "Can I sign on my phone?", a: "Yes — drawing with a finger works in mobile browsers." },
    ],
  },
  {
    slug: "how-to-convert-pdf-to-word",
    title: "How to Convert PDF to Word",
    description: "Turn PDFs into editable .docx files online with MyPDFKitty.",
    category: "PDF conversion",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/pdf-to-word",
    primaryToolLabel: "PDF to Word Converter",
    relatedToolSlugs: ["word-to-pdf", "edit-pdf", "ocr-pdf"],
    relatedPostSlug: "how-to-convert-word-to-pdf",
    answer:
      "To convert a PDF to Word online, upload the PDF to MyPDFKitty's PDF to Word tool. We extract the text into an editable .docx file you can open in Word, Google Docs, or Pages.",
    howToSteps: [
      { name: "Open PDF to Word", text: "Go to MyPDFKitty's PDF to Word converter." },
      { name: "Upload the PDF", text: "Drop the PDF onto the upload box." },
      { name: "Convert", text: "MyPDFKitty extracts the text into an editable file." },
      { name: "Download .docx", text: "Open the result in your favorite editor." },
    ],
    body: [
      { type: "p", text: "PDF to Word is the right tool when you need to update copy that lives inside a PDF. Plain text and basic formatting carry across cleanly; complex tables may need light cleanup." },
    ],
    faq: [
      { q: "Will tables convert?", a: "Simple tables convert well. Complex multi-column layouts may need adjustment." },
      { q: "Does it work on scanned PDFs?", a: "Run OCR first to extract the text, then convert to Word." },
    ],
  },
  {
    slug: "how-to-convert-word-to-pdf",
    title: "How to Convert Word to PDF",
    description: "Export Word documents as clean PDFs online with MyPDFKitty.",
    category: "PDF conversion",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/word-to-pdf",
    primaryToolLabel: "Word to PDF Converter",
    relatedToolSlugs: ["pdf-to-word", "merge-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-convert-pdf-to-word",
    answer:
      "To convert Word to PDF online, upload your .doc or .docx file to MyPDFKitty. We export it as a PDF that looks the same on every device.",
    howToSteps: [
      { name: "Open Word to PDF", text: "Go to the Word to PDF converter." },
      { name: "Upload your file", text: "Drop a .doc or .docx file." },
      { name: "Convert", text: "MyPDFKitty exports a PDF that preserves your layout." },
      { name: "Download", text: "Use the PDF anywhere." },
    ],
    body: [
      { type: "p", text: "Exporting to PDF locks edits and makes sure your reader sees the same fonts and layout you do." },
    ],
    faq: [
      { q: "What if I use unusual fonts?", a: "Embed them in Word before exporting." },
      { q: "Can I add a password?", a: "Password protection is on the roadmap." },
    ],
  },
  {
    slug: "how-to-convert-jpg-to-pdf",
    title: "How to Convert JPG to PDF",
    description: "Combine images into a single PDF online using MyPDFKitty.",
    category: "PDF conversion",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/jpg-to-pdf",
    primaryToolLabel: "JPG to PDF Converter",
    relatedToolSlugs: ["pdf-to-jpg", "merge-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-convert-pdf-to-jpg",
    answer:
      "To convert JPG to PDF, upload one or more JPG/PNG images to MyPDFKitty. Each image becomes a page; download a single combined PDF.",
    howToSteps: [
      { name: "Upload images", text: "Drop one or more JPG or PNG files." },
      { name: "Order pages", text: "Use Manage Pages to reorder or rotate." },
      { name: "Download the PDF", text: "Save your photos as one tidy PDF." },
    ],
    body: [
      { type: "p", text: "JPG to PDF is great for receipts, scans from your phone, application photos, or product images you need to send as one document." },
    ],
    faq: [
      { q: "Can I add multiple images at once?", a: "Yes — drop them together." },
      { q: "What formats are supported?", a: "JPG and PNG today." },
    ],
  },
  {
    slug: "how-to-convert-pdf-to-jpg",
    title: "How to Convert PDF to JPG",
    description: "Export each page of a PDF as a JPG image with MyPDFKitty.",
    category: "PDF conversion",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/pdf-to-jpg",
    primaryToolLabel: "PDF to JPG Converter",
    relatedToolSlugs: ["jpg-to-pdf", "split-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-convert-jpg-to-pdf",
    answer:
      "To convert PDF to JPG, upload your PDF to MyPDFKitty. Each page exports as a high-quality JPG you can share, embed, or post.",
    howToSteps: [
      { name: "Upload the PDF", text: "Drop the PDF you want to turn into images." },
      { name: "Pick pages", text: "Choose all pages or specific ranges." },
      { name: "Download the JPGs", text: "Get one JPG per page." },
    ],
    body: [
      { type: "p", text: "Use this tool when someone needs a quick visual of a single page, when you want to embed a PDF page into a deck, or when sharing on chat apps that don't preview PDFs." },
    ],
    faq: [
      { q: "What's the resolution?", a: "Each page exports at a high enough resolution for screens and standard sharing." },
      { q: "Can I export only one page?", a: "Use Split PDF first, then convert that PDF to JPG." },
    ],
  },
  {
    slug: "how-to-convert-scanned-pdf-to-text",
    title: "How to Convert a Scanned PDF to Text",
    description: "Use OCR to make a scanned PDF searchable, selectable, and editable with MyPDFKitty.",
    category: "PDF conversion",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/ocr-pdf",
    primaryToolLabel: "OCR PDF Online",
    relatedToolSlugs: ["ai-summarizer", "chat-pdf", "pdf-to-word"],
    relatedPostSlug: "how-to-summarize-a-pdf-with-ai",
    answer:
      "To convert a scanned PDF to text, upload it to MyPDFKitty's OCR PDF tool. We run optical character recognition on each page and return the text so you can search, copy, or feed it into AI tools.",
    howToSteps: [
      { name: "Upload the scan", text: "Drop a scanned PDF from your phone or scanner." },
      { name: "Run OCR", text: "MyPDFKitty extracts the text from each page." },
      { name: "Use the text", text: "Search, copy, summarize, or chat with the result." },
    ],
    body: [
      { type: "p", text: "Scanned PDFs are essentially packs of images — your computer can't search or copy text from them until you run OCR. Once converted, the text becomes selectable and AI tools can read it." },
    ],
    faq: [
      { q: "How accurate is OCR?", a: "Clean scans are near-perfect. Faint or skewed scans need cleanup." },
      { q: "Does it work in other languages?", a: "Multi-language support is rolling out — English-language scans work today." },
    ],
  },
  {
    slug: "how-to-summarize-a-pdf-with-ai",
    title: "How to Summarize a PDF with AI",
    description: "Use AI to summarize long PDFs into short summaries, key points, takeaways, and actions with MyPDFKitty.",
    category: "AI PDF",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/ai-pdf-summarizer",
    primaryToolLabel: "AI PDF Summarizer",
    relatedToolSlugs: ["chat-pdf", "key-points", "ocr-pdf"],
    relatedPostSlug: "how-to-chat-with-a-pdf",
    answer:
      "To summarize a PDF with AI, upload it to MyPDFKitty's AI PDF Summarizer. We extract the text, send it to a language model, and return a short summary, highlight bullets, takeaways, and action items.",
    howToSteps: [
      { name: "Upload your PDF", text: "Drop a report, paper, or contract on the upload box." },
      { name: "Run the summarizer", text: "MyPDFKitty extracts the text and asks the AI to summarize it." },
      { name: "Skim the highlights", text: "Read the short summary, bullets, takeaways, and actions." },
    ],
    body: [
      { type: "h2", text: "When AI summaries help" },
      { type: "ul", items: [
        "Triaging a 40-page report before a meeting.",
        "Briefing a teammate on a doc you don't have time to read.",
        "Pulling action items out of meeting notes saved as PDFs.",
        "Skimming a research paper before deciding whether to read in full.",
      ] },
      { type: "callout", text: "AI features require a Pro or Business plan. Free accounts can preview the tool layout." },
    ],
    faq: [
      { q: "What if the PDF is a scan?", a: "Run OCR first using the OCR PDF tool, then summarize." },
      { q: "How long can the PDF be?", a: "Long PDFs are truncated to fit the AI model's context. Summarize in sections for very large docs." },
    ],
  },
  {
    slug: "best-ai-pdf-summarizer-tools",
    title: "Best AI PDF Summarizer Tools in 2026",
    description: "A comparison of AI PDF summarizers for students, professionals and small teams.",
    category: "AI PDF",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/ai-pdf-summarizer",
    primaryToolLabel: "AI PDF Summarizer",
    relatedToolSlugs: ["chat-pdf", "key-points", "ocr-pdf"],
    relatedPostSlug: "how-to-summarize-a-pdf-with-ai",
    answer:
      "The best AI PDF summarizer for most people is one that combines accurate text extraction, citations to the original page, and a workflow that fits how you actually work. MyPDFKitty's summarizer returns a short summary, bullet highlights, takeaways, and action items in seconds.",
    body: [
      { type: "h2", text: "What to look for" },
      { type: "ul", items: [
        "Accurate text extraction (including from scanned PDFs after OCR).",
        "Page-cited answers so you can verify claims.",
        "Output formats that match how you'll use the summary (short prose vs bullets vs actions).",
        "Reasonable file size limits and sane pricing.",
      ] },
      { type: "callout", text: "Comparison data on competitor tools is updated periodically. Always verify current pricing and limits on each provider's site before purchasing." },
    ],
    faq: [
      { q: "Can I use AI summarizers on contracts?", a: "Yes for triage, but always have a human review the actual contract for legal decisions." },
      { q: "What about privacy?", a: "Look for tools that isolate uploads to your account and offer delete controls." },
    ],
  },
  {
    slug: "how-to-chat-with-a-pdf",
    title: "How to Chat With a PDF",
    description: "Ask questions about a PDF and get answers grounded in the document with MyPDFKitty.",
    category: "AI PDF",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/chat-with-pdf",
    primaryToolLabel: "Chat With PDF",
    relatedToolSlugs: ["ai-summarizer", "key-points", "ocr-pdf"],
    relatedPostSlug: "how-to-summarize-a-pdf-with-ai",
    answer:
      "To chat with a PDF, upload your file to MyPDFKitty, type a question in plain English, and get an answer that's grounded in the document. Answers cite the pages they used so you can verify them.",
    howToSteps: [
      { name: "Upload your PDF", text: "Drop the document you want to chat with." },
      { name: "Ask a question", text: "Type a specific question — the more focused, the better." },
      { name: "Read the answer", text: "Use the cited page numbers to verify and follow up." },
    ],
    body: [
      { type: "p", text: "Chatting with a PDF is faster than skimming when you already know what you're looking for. It works best on text-based PDFs; scans need OCR first." },
    ],
    faq: [
      { q: "Are answers cited?", a: "Yes — page numbers are included so you can verify." },
      { q: "Can I chat with multiple PDFs at once?", a: "Today the chat is per-document. Multi-doc workspaces are on the roadmap." },
    ],
  },
  {
    slug: "how-to-summarize-a-research-paper-with-ai",
    title: "How to Summarize a Research Paper with AI",
    description: "A practical guide to using AI to summarize research papers and academic PDFs.",
    category: "Student PDFs",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/ai-pdf-summarizer",
    primaryToolLabel: "AI PDF Summarizer",
    relatedToolSlugs: ["chat-pdf", "key-points", "ocr-pdf"],
    relatedPostSlug: "how-to-summarize-a-pdf-with-ai",
    answer:
      "To summarize a research paper with AI, upload the PDF to MyPDFKitty's AI PDF Summarizer. We return a short overview, the methodology in plain English, key findings, and limitations — all cited to specific pages of the paper.",
    howToSteps: [
      { name: "Upload the paper", text: "Drop the research PDF onto the upload box." },
      { name: "Generate the summary", text: "Pick the AI Summarizer." },
      { name: "Verify the highlights", text: "Cross-check the summary against the abstract and the cited pages." },
    ],
    body: [
      { type: "h2", text: "What AI summarizers do well on papers" },
      { type: "ul", items: [
        "Restating the abstract in plain English.",
        "Pulling out key findings and limitations.",
        "Listing methodology and dataset details.",
        "Surfacing references to other influential papers.",
      ] },
      { type: "callout", text: "Always verify citations and numbers in the original paper before quoting an AI summary." },
    ],
    faq: [
      { q: "Can it handle scanned PDFs?", a: "Run OCR first." },
      { q: "How long can the paper be?", a: "Most journal papers fit. For very long theses, summarize section by section." },
    ],
  },
  {
    slug: "how-to-compress-a-pdf-for-email",
    title: "How to Compress a PDF for Email",
    description: "Shrink PDFs to fit Gmail and Outlook attachment limits using MyPDFKitty.",
    category: "Business documents",
    publishedAt: "2026-01-08",
    primaryToolHref: "/tools/compress-pdf",
    primaryToolLabel: "Compress PDF Online",
    relatedToolSlugs: ["merge-pdf", "split-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-compress-a-pdf-online",
    answer:
      "To compress a PDF for email, upload it to MyPDFKitty's Compress PDF tool. Aim for a final size under 10 MB for Gmail and 20 MB for Outlook so it goes through reliably.",
    howToSteps: [
      { name: "Open Compress PDF", text: "Go to the Compress PDF tool." },
      { name: "Upload your file", text: "Drop the PDF you need to email." },
      { name: "Download & attach", text: "Save the smaller file and attach it to your email." },
    ],
    body: [
      { type: "h2", text: "Email attachment limits to know" },
      { type: "ul", items: [
        "Gmail: 25 MB total per message (compressed PDFs should target under 10 MB to be safe).",
        "Outlook (Microsoft 365): 20–25 MB per message depending on settings.",
        "Many corporate inboxes block anything above 10 MB.",
      ] },
    ],
    faq: [
      { q: "What's the safest target size?", a: "Under 10 MB will work almost everywhere." },
      { q: "What if it's still too big?", a: "Split the PDF and email in parts, or share a download link." },
    ],
  },
  // ---------------------------------------------------------------------
  // "Online free" intent variants (high-volume search terms). These are
  // shorter, answer-first, action-focused — they exist to rank for the
  // "<task> online free" cluster and funnel users straight to the tool.
  // ---------------------------------------------------------------------
  {
    slug: "how-to-sign-a-pdf-online-free",
    title: "How to Sign a PDF Online Free",
    description: "Sign a PDF online for free in under a minute — no install, no credit card.",
    category: "PDF editing",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/sign-pdf",
    primaryToolLabel: "Sign PDF Online Free",
    relatedToolSlugs: ["edit-pdf", "merge-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-edit-a-pdf-online-free",
    answer:
      "To sign a PDF online for free, open MyPDFKitty's Sign PDF tool, upload your file, type or draw your signature, place it on the right page, and click Done to download the signed PDF. The tool is free, runs in your browser, and doesn't ask for a credit card.",
    howToSteps: [
      { name: "Open Sign PDF", text: "Go to MyPDFKitty's Sign PDF tool — it's free." },
      { name: "Upload the PDF", text: "Drop the contract, form, or letter you need to sign." },
      { name: "Add your signature", text: "Type, draw, or upload an image of your signature." },
      { name: "Place and download", text: "Drag the signature where you want it and click Done to save the signed PDF." },
    ],
    body: [
      { type: "h2", text: "Is signing a PDF online really free?" },
      { type: "p", text: "Yes. MyPDFKitty's signing tool is free. Files up to 10 MB on the Free plan, no watermark, no email required to download." },
      { type: "h2", text: "Common problems" },
      { type: "ul", items: [
        "Signature looks too small — drag a corner handle to resize before saving.",
        "Wrong page — click the signature, drag it to the right page, or use Manage Pages.",
        "Need initials on every page — copy the placed signature, paste, repeat.",
      ] },
    ],
    faq: [
      { q: "Are typed signatures legally binding?", a: "For most everyday agreements yes. For regulated workflows (banking, real estate in some jurisdictions), use a service that supports eIDAS/qualified signatures." },
      { q: "Will my signed PDF have a watermark?", a: "No. Free downloads are clean — no watermark, no branding." },
    ],
  },
  {
    slug: "how-to-convert-pdf-to-word-online-free",
    title: "How to Convert PDF to Word Online Free",
    description: "Convert a PDF to an editable .docx for free in your browser.",
    category: "PDF conversion",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/pdf-to-word",
    primaryToolLabel: "Convert PDF to Word Online Free",
    relatedToolSlugs: ["word-to-pdf", "edit-pdf", "ocr-pdf"],
    relatedPostSlug: "how-to-edit-a-pdf-online-free",
    answer:
      "To convert a PDF to Word online for free, open MyPDFKitty's PDF to Word tool, upload the PDF, click Convert to Word, and download the .docx. The conversion is free for files up to 10 MB; open the result in Word, Google Docs, or Pages.",
    howToSteps: [
      { name: "Open PDF to Word", text: "Go to MyPDFKitty's free PDF to Word converter." },
      { name: "Upload your PDF", text: "Drop the PDF onto the upload box." },
      { name: "Convert", text: "Click Convert to Word — text is extracted into an editable file." },
      { name: "Download the .docx", text: "Open the result in Word, Google Docs, or Pages." },
    ],
    body: [
      { type: "h2", text: "What gets preserved?" },
      { type: "ul", items: [
        "Plain text and basic paragraph structure.",
        "Headings (when the PDF uses real headings, not big text).",
        "Bullet and numbered lists.",
      ] },
      { type: "h2", text: "What needs cleanup" },
      { type: "ul", items: [
        "Complex tables and multi-column layouts may need manual fixes.",
        "Inline formatting (bold/italic mid-paragraph) is flattened.",
        "Images are skipped — copy them from the original PDF if needed.",
      ] },
      { type: "callout", text: "Scanned PDF? Run OCR first to extract the text, then convert." },
    ],
    faq: [
      { q: "Is the conversion really free?", a: "Yes — files up to 10 MB on the Free plan, no watermark, no email required to download." },
      { q: "Why is my converted document missing tables?", a: "Tables in PDFs are tricky. We preserve plain text reliably; complex tables are on the roadmap." },
    ],
  },
  {
    slug: "how-to-convert-jpg-to-png-online-free",
    title: "How to Convert JPG to PNG Online Free",
    description: "Convert JPG to PNG free, in your browser — no upload to a server.",
    category: "PDF conversion",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/jpg-to-png",
    primaryToolLabel: "Convert JPG to PNG Online Free",
    relatedToolSlugs: ["png-to-jpg", "jpg-to-pdf", "pdf-to-jpg"],
    answer:
      "To convert a JPG to PNG online for free, open MyPDFKitty's JPG to PNG tool, drop your JPG, click Convert to PNG, and download. The conversion runs entirely in your browser — your image never leaves your computer.",
    howToSteps: [
      { name: "Open the tool", text: "Go to MyPDFKitty's free JPG to PNG converter." },
      { name: "Upload your JPG", text: "Drop a JPG onto the upload box." },
      { name: "Convert", text: "Click Convert to PNG — your browser re-encodes the image locally." },
      { name: "Download the PNG", text: "Save the result." },
    ],
    body: [
      { type: "p", text: "PNG is lossless and supports transparency, while JPG is smaller but lossy. Converting JPG → PNG is useful for design work, web tools that demand PNG uploads, or when you'll edit the image again and want to avoid re-compression artifacts." },
    ],
    faq: [
      { q: "Will my image quality improve?", a: "PNG is lossless going forward, but it can't recover detail JPG already discarded. Expect the same visual quality as the source JPG, just in a lossless container." },
      { q: "Where does the conversion happen?", a: "Entirely in your browser — your image is never uploaded to a server." },
    ],
  },
  {
    slug: "how-to-compress-a-pdf-online-free",
    title: "How to Compress a PDF Online Free",
    description: "Shrink a PDF online for free so you can email it or upload it without limits.",
    category: "PDF editing",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/compress-pdf",
    primaryToolLabel: "Compress PDF Online Free",
    relatedToolSlugs: ["merge-pdf", "split-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-compress-a-pdf-for-email",
    answer:
      "To compress a PDF online for free, open MyPDFKitty's Compress PDF tool, upload your file, and click Compress PDF. We re-save it with optimized streams and show you both the original and new size so you can decide whether to use the result. Free for files up to 10 MB.",
    howToSteps: [
      { name: "Open Compress PDF", text: "Go to MyPDFKitty's free Compress PDF tool." },
      { name: "Upload your PDF", text: "Drop or browse to select your file." },
      { name: "Compress", text: "Click Compress PDF and wait a few seconds." },
      { name: "Download", text: "We show original vs new size; download the smaller version." },
    ],
    body: [
      { type: "h2", text: "Common problems" },
      { type: "ul", items: [
        "PDF didn't shrink much — usually means it's already optimized text or scanned imagery.",
        "Need it under 5 MB for an ATS — split out unneeded pages first.",
      ] },
    ],
    faq: [
      { q: "Is there a watermark?", a: "No. Free downloads are clean." },
      { q: "What's the file size limit?", a: "10 MB on Free, 100 MB on Pro, 500 MB on Business." },
    ],
  },
  {
    slug: "how-to-merge-pdf-files-online-free",
    title: "How to Merge PDF Files Online Free",
    description: "Combine multiple PDFs into one file online — free, no install.",
    category: "PDF editing",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/merge-pdf",
    primaryToolLabel: "Merge PDF Online Free",
    relatedToolSlugs: ["split-pdf", "compress-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-split-a-pdf-online-free",
    answer:
      "To merge PDFs online for free, open MyPDFKitty's Merge PDF tool, drop two or more PDFs, drag them into the order you want, and click Merge PDFs. The combined PDF downloads in seconds — clean output, no watermark.",
    howToSteps: [
      { name: "Open Merge PDF", text: "Go to MyPDFKitty's free Merge PDF tool." },
      { name: "Add your files", text: "Drop two or more PDFs together onto the upload box." },
      { name: "Reorder them", text: "Drag the file rows to set the order you want." },
      { name: "Merge & download", text: "Click Merge PDFs to combine and download." },
    ],
    body: [{ type: "p", text: "Merging is the fastest way to send a single file instead of three: receipts, contracts, scans, application materials." }],
    faq: [
      { q: "Is there a file count limit?", a: "Plan dependent. Free covers everyday use." },
      { q: "Does the merged PDF have a watermark?", a: "No." },
    ],
  },
  {
    slug: "how-to-split-a-pdf-online-free",
    title: "How to Split a PDF Online Free",
    description: "Extract specific pages or split a PDF into multiple files online for free.",
    category: "PDF editing",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/split-pdf",
    primaryToolLabel: "Split PDF Online Free",
    relatedToolSlugs: ["merge-pdf", "compress-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-merge-pdf-files-online-free",
    answer:
      "To split a PDF online for free, open MyPDFKitty's Split PDF tool, upload your file, type the pages or ranges you want (for example 1-3, 5, 8-10), and click Extract pages. The new PDF downloads in seconds.",
    howToSteps: [
      { name: "Open Split PDF", text: "Go to MyPDFKitty's free Split PDF tool." },
      { name: "Upload your PDF", text: "Drop a single PDF onto the upload box." },
      { name: "Pick pages", text: "Type ranges like 1-3, 5, 8-10." },
      { name: "Extract & download", text: "Click Extract pages and save the new PDF." },
    ],
    body: [{ type: "p", text: "Use Split when you only need a few chapters, when you're trimming duplicates, or when you're sending one section of a contract." }],
    faq: [
      { q: "Can I extract a single page?", a: "Yes — type the page number (e.g. 5)." },
      { q: "Will formatting be preserved?", a: "Yes." },
    ],
  },
  {
    slug: "how-to-edit-a-pdf-online-free",
    title: "How to Edit a PDF Online Free",
    description: "Add text, signatures, images, and notes to a PDF online — free.",
    category: "PDF editing",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/edit-pdf",
    primaryToolLabel: "Edit PDF Online Free",
    relatedToolSlugs: ["sign-pdf", "merge-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-sign-a-pdf-online-free",
    answer:
      "To edit a PDF online for free, open MyPDFKitty's editor, upload your file, and use the toolbar to add text, highlights, images, signatures, and notes. Click Done to download a flattened PDF with your edits saved. Free for files up to 10 MB, no watermark.",
    howToSteps: [
      { name: "Open the editor", text: "Go to MyPDFKitty's free Edit PDF tool." },
      { name: "Upload the PDF", text: "Drop your PDF in the editor." },
      { name: "Make edits", text: "Add text, highlights, images, signatures, or notes from the toolbar." },
      { name: "Save", text: "Click Done and download the edited PDF." },
    ],
    body: [{ type: "p", text: "The editor handles the everyday stuff: filling forms that aren't really fillable, leaving notes on a contract, adding a logo, or rearranging pages." }],
    faq: [
      { q: "Can I edit existing PDF text?", a: "You can add new text and shapes today. Rewriting the original PDF text is on the roadmap." },
      { q: "Watermark on free downloads?", a: "No watermark." },
    ],
  },
  {
    slug: "how-to-convert-jpg-to-pdf-online-free",
    title: "How to Convert JPG to PDF Online Free",
    description: "Combine images into a single PDF online — free.",
    category: "PDF conversion",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/jpg-to-pdf",
    primaryToolLabel: "Convert JPG to PDF Online Free",
    relatedToolSlugs: ["pdf-to-jpg", "jpg-to-png", "compress-pdf"],
    answer:
      "To convert JPG to PDF online for free, open MyPDFKitty's JPG to PDF tool, drop one or more JPG/PNG images, drag to reorder, and click Convert. Each image becomes a page in the resulting PDF.",
    howToSteps: [
      { name: "Open JPG to PDF", text: "Go to MyPDFKitty's free JPG to PDF tool." },
      { name: "Upload images", text: "Drop one or more JPGs (or PNGs)." },
      { name: "Order pages", text: "Drag the file rows to set the order." },
      { name: "Convert & download", text: "Click Convert images to PDF and save." },
    ],
    body: [{ type: "p", text: "Common cases: receipts to expense reports, phone scans to a multi-page document, application photos to one PDF." }],
    faq: [
      { q: "What formats are supported?", a: "JPG and PNG today." },
      { q: "Is there a watermark?", a: "No." },
    ],
  },
  {
    slug: "how-to-convert-word-to-pdf-online-free",
    title: "How to Convert Word to PDF Online Free",
    description: "Convert .docx to PDF online — free, no install.",
    category: "PDF conversion",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/word-to-pdf",
    primaryToolLabel: "Convert Word to PDF Online Free",
    relatedToolSlugs: ["pdf-to-word", "merge-pdf", "compress-pdf"],
    relatedPostSlug: "how-to-convert-pdf-to-word-online-free",
    answer:
      "To convert Word to PDF online for free, open MyPDFKitty's Word to PDF tool, upload your .doc/.docx file, and click Convert to PDF. We rebuild the document as a PDF preserving headings, paragraphs, and lists. Free for files up to 10 MB, no watermark.",
    howToSteps: [
      { name: "Open Word to PDF", text: "Go to MyPDFKitty's free Word to PDF converter." },
      { name: "Upload your file", text: "Drop a .doc or .docx file." },
      { name: "Convert", text: "Click Convert to PDF." },
      { name: "Download", text: "Save the PDF and use it anywhere." },
    ],
    body: [
      { type: "h2", text: "What's preserved" },
      { type: "ul", items: ["Headings, paragraphs, and bullet/numbered lists.", "Text content and basic formatting."] },
      { type: "h2", text: "What's not (yet)" },
      { type: "ul", items: ["Tables and embedded images aren't preserved in v1 — they're on the roadmap."] },
    ],
    faq: [
      { q: "Will my fonts be preserved?", a: "Standard fonts are mapped to Helvetica/Times/Courier. For exact font fidelity, export to PDF directly from Word/Pages." },
    ],
  },
  {
    slug: "how-to-summarize-a-pdf-with-ai-free",
    title: "How to Summarize a PDF with AI Free",
    description: "Summarize a PDF with AI online — free, with smart limits.",
    category: "AI PDF",
    publishedAt: "2026-02-01",
    primaryToolHref: "/tools/ai-pdf-summarizer",
    primaryToolLabel: "AI PDF Summarizer Free",
    relatedToolSlugs: ["chat-pdf", "key-points", "ocr-pdf"],
    relatedPostSlug: "how-to-summarize-a-pdf-with-ai",
    answer:
      "To summarize a PDF with AI for free, open MyPDFKitty's AI PDF Summarizer, upload a PDF, and we'll return a short summary, bulleted highlights, key takeaways, and action items. Free users get 3 summaries per day on PDFs up to ~6 pages of text — upgrade to Pro for larger documents and 100/day.",
    howToSteps: [
      { name: "Open the summarizer", text: "Go to MyPDFKitty's AI PDF Summarizer." },
      { name: "Upload your PDF", text: "Drop a report, paper, or contract." },
      { name: "Generate", text: "We extract the text and ask the AI to summarize it." },
      { name: "Review", text: "Read the short summary, highlights, takeaways, and actions." },
    ],
    body: [
      { type: "callout", text: "Free plan: 3 summaries/day on PDFs up to ~8,000 characters of text. Pro: 100/day on much larger files. Business: effectively unlimited." },
    ],
    faq: [
      { q: "Is AI summarization really free?", a: "Yes, with daily limits. Sign in (free) and you can summarize 3 short PDFs every day." },
      { q: "What if the PDF is a scan?", a: "Run OCR first to extract the text, then summarize." },
    ],
  },
  // -------------------------------------------------------------------
  // Translation: language-pair posts. Each targets a "translate <lang>
  // pdf to english" search. We only ship a curated set of the highest-
  // volume language pairs here; the dynamic /tools/translate-pdf/[slug]
  // pages cover the long tail of pair URLs even without a matching post.
  // -------------------------------------------------------------------
  {
    slug: "how-to-translate-pdf-online-free",
    title: "How to Translate a PDF Online Free",
    description: "Translate any PDF between 25+ languages online with AI — free.",
    category: "AI PDF",
    publishedAt: "2026-03-01",
    primaryToolHref: "/tools/translate-pdf",
    primaryToolLabel: "Translate PDF Online Free",
    relatedToolSlugs: ["translate-pdf", "ocr-pdf", "ai-summarizer", "chat-pdf"],
    relatedPostSlug: "how-to-translate-hindi-pdf-to-english",
    answer:
      "To translate a PDF online for free, open MyPDFKitty's Translate PDF tool, upload your file, choose the source language (or auto-detect) and the target language, and click Translate. We extract the text via AI and return a clean translation you can copy or download.",
    howToSteps: [
      { name: "Open Translate PDF", text: "Go to MyPDFKitty's free PDF translator." },
      { name: "Upload your PDF", text: "Drop a text-based PDF (run OCR first if it's a scan)." },
      { name: "Pick languages", text: "Auto-detect the source or pick from 25 languages, then choose your target language." },
      { name: "Translate", text: "Click Translate, then copy the result or download .txt." },
    ],
    body: [
      { type: "h2", text: "What languages are supported?" },
      { type: "p", text: "All 25 of the most-spoken languages — English, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Russian, Turkish, Arabic, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Chinese, Japanese, Korean, Vietnamese, Thai, Indonesian, and Tagalog." },
      { type: "h2", text: "Tips for good results" },
      { type: "ul", items: [
        "If your PDF is a scan, run OCR PDF first.",
        "Auto-detect works well, but explicitly picking the source improves accuracy.",
        "Numbers, dates, and names are preserved as-is.",
      ] },
    ],
    faq: [
      { q: "Is this really free?", a: "Free users get 1 translation per month. Paid plans include 25–250 per month." },
      { q: "How accurate is it?", a: "Excellent for everyday documents. For legal, medical, or technical content, have a native speaker review." },
    ],
  },
  ...buildTranslationPost("hindi", "english", "Hindi", "English"),
  ...buildTranslationPost("spanish", "english", "Spanish", "English"),
  ...buildTranslationPost("chinese", "english", "Chinese", "English"),
  ...buildTranslationPost("french", "english", "French", "English"),
  ...buildTranslationPost("arabic", "english", "Arabic", "English"),
  ...buildTranslationPost("japanese", "english", "Japanese", "English"),
  ...buildTranslationPost("korean", "english", "Korean", "English"),
  ...buildTranslationPost("german", "english", "German", "English"),
  ...buildTranslationPost("portuguese", "english", "Portuguese", "English"),
  ...buildTranslationPost("russian", "english", "Russian", "English"),

  // ---------------------------------------------------------------------
  // Bulk how-to expansion — 12 fresh long-tail posts (May 2026)
  // ---------------------------------------------------------------------
  {
    slug: "how-to-redact-a-pdf",
    title: "How to Redact a PDF (Real Redaction, Not Black Boxes)",
    description:
      "Permanently hide sensitive info in a PDF — names, SSNs, account numbers. Real redaction strips the underlying text so it can't be recovered.",
    category: "PDF editing",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/edit-pdf",
    primaryToolLabel: "Open the PDF editor",
    relatedToolSlugs: ["edit-pdf", "compress-pdf", "ocr-pdf"],
    relatedPostSlug: "how-to-remove-password-from-pdf",
    answer:
      "To redact a PDF, upload it, mark each region of sensitive text or image, and apply real redaction — which strips the underlying text from the file. Saving a redacted PDF is irreversible, so always keep an unredacted original. Black-box overlays in basic editors don't count as redaction; the hidden text can be copied or recovered.",
    howToSteps: [
      { name: "Upload the PDF", text: "Open the PDF editor and drop your file." },
      { name: "Mark regions", text: "Drag boxes over names, SSNs, addresses — anything you want hidden." },
      { name: "Apply redaction", text: "We strip the underlying text and burn a black region into the PDF." },
      { name: "Verify and save", text: "Search for redacted terms after saving — they should return zero hits." },
    ],
    body: [
      { type: "h2", text: "What real redaction means" },
      { type: "p", text: "There are two kinds of 'redaction' floating around the internet. The fake kind is drawing a black rectangle over text in a regular PDF editor — the underlying text stays in the file, and anyone with Acrobat can drag the rectangle aside or copy the hidden text. Lawyers have exposed client SSNs this way. The real kind — what compliance officers, court clerks, and corporate counsel mean — strips the text from the underlying PDF and replaces it with a solid black region. Even copy-paste, search, and OCR-on-the-redacted-file can't recover the data." },
      { type: "h2", text: "What you should redact" },
      { type: "ul", items: [
        "Social Security numbers (full SSN; partial last-4 is sometimes OK)",
        "Full credit-card and bank account numbers",
        "Dates of birth in court filings (PACER rules)",
        "Home addresses for protected witnesses, juveniles, and victims",
        "Medical records (HIPAA — names plus diagnosis or treatment)",
        "Trade secrets when sharing contracts with prospective vendors",
        "Names of minors in any legal filing",
      ] },
      { type: "h2", text: "The order of operations" },
      { type: "ol", items: [
        "Make a backup of the original (un-redacted) PDF in secure storage.",
        "Open the redaction tool and mark every region.",
        "Apply redaction — this is the destructive step.",
        "Search the redacted file for any sensitive term you redacted. Zero hits = success.",
        "Strip metadata (Author, Title, Comments) before sharing.",
        "Save the redacted PDF with a clear filename like 'Smith_v_Jones_REDACTED.pdf'.",
      ] },
      { type: "h2", text: "Common mistakes" },
      { type: "ul", items: [
        "Drawing a black shape in a regular editor and assuming it counts. It doesn't.",
        "Redacting the visible text but forgetting metadata (Author field often contains the editor's name).",
        "Compressing first, redacting second — compression can rasterize text, making redaction harder to verify.",
        "Sharing the redacted PDF without checking — open and search for the redacted terms before sending.",
      ] },
      { type: "callout", text: "Redaction is irreversible. Once saved, the redacted text is gone from that file forever — even from your own copy. Always keep the original separately." },
    ],
    faq: [
      { q: "Can someone recover redacted text?", a: "Not from a properly redacted PDF — the text is stripped from the underlying document. Only fake 'cover with a shape' redactions can be recovered." },
      { q: "Does redaction work on scanned PDFs?", a: "Yes — for scans, the redaction blacks out the image region. Run OCR before sharing if you also want the redacted PDF to be searchable on the non-redacted parts." },
      { q: "Is this OK for HIPAA / GDPR?", a: "Real redaction satisfies the technical bar for HIPAA and GDPR. You're still responsible for the broader compliance program (consent, breach notification, retention)." },
    ],
  },
  {
    slug: "how-to-remove-password-from-pdf",
    title: "How to Remove the Password from a PDF",
    description:
      "Remove a password from a PDF you own. Two kinds of PDF passwords explained, when each can be removed, and how to do it in your browser.",
    category: "PDF editing",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/edit-pdf",
    primaryToolLabel: "Open the PDF editor",
    relatedToolSlugs: ["edit-pdf", "compress-pdf", "merge-pdf"],
    relatedPostSlug: "how-to-redact-a-pdf",
    answer:
      "If you know the password, upload the PDF, enter the password, and save a new copy without protection. We don't crack passwords — that's both legally questionable and technically infeasible for modern AES-256 encryption. PDFs have two password types: an open password (you need it to view the file) and a permissions password (you can view but not print/edit/copy). Both can be removed when you know the password.",
    howToSteps: [
      { name: "Upload the PDF", text: "Drop the password-protected file into our editor." },
      { name: "Enter the password", text: "Type the open password if prompted, or the permissions password if you need to edit." },
      { name: "Save unprotected", text: "Click 'Save without password' and download the new copy." },
      { name: "Verify", text: "Open the new PDF — should not prompt for a password." },
    ],
    body: [
      { type: "h2", text: "Two kinds of PDF passwords" },
      { type: "p", text: "PDFs can be locked two different ways, and the difference matters." },
      { type: "h3", text: "Open password" },
      { type: "p", text: "Required to even view the file. The PDF is encrypted on disk and can't be opened without the password. AES-256 by default in modern PDFs — practically unbreakable without the password." },
      { type: "h3", text: "Permissions password (owner password)" },
      { type: "p", text: "The PDF opens for anyone, but printing, editing, copying, and signing are restricted. The permissions password lifts the restrictions. Many PDFs only set this — that's why a 'locked' PDF often opens fine but won't let you edit." },
      { type: "h2", text: "When you can remove the password" },
      { type: "ul", items: [
        "You set the password yourself — easy, you know it.",
        "Someone shared the password with you — easy, they know it.",
        "You forgot your own password — hard. Try every variant you commonly use; if it's a permissions password, some PDFs are removable without it.",
        "The PDF is from someone else and they didn't share the password — don't try to crack it. That's typically illegal under DMCA Section 1201 and the Computer Fraud and Abuse Act.",
      ] },
      { type: "h2", text: "Step-by-step (when you know the password)" },
      { type: "ol", items: [
        "Upload the PDF to our editor.",
        "Enter the password when prompted.",
        "Choose 'Save without password' from the export options.",
        "Download the new, unprotected PDF.",
      ] },
      { type: "h2", text: "What we won't do" },
      { type: "p", text: "We don't crack passwords. Modern PDFs use AES-256 encryption, which is computationally infeasible to brute-force without the key. More importantly, removing a password you don't have is usually illegal — even if you 'own' the PDF in some sense. If you're locked out of your own document, contact the original sender." },
    ],
    faq: [
      { q: "Is it legal to remove a PDF password?", a: "Removing a password from a PDF you own or have explicit permission to modify is legal. Removing it from someone else's PDF without permission likely violates DMCA Section 1201 in the US." },
      { q: "Can you crack PDF passwords?", a: "No — modern PDF encryption (AES-256) is strong enough that brute-force is infeasible, and we wouldn't offer it even if we could. Contact the original sender if you've lost access." },
      { q: "What's the difference between encryption and a password?", a: "The password is what you type; encryption is the math that scrambles the file. PDFs use AES-128 or AES-256 encryption, with the password as the key." },
    ],
  },
  {
    slug: "how-to-add-page-numbers-to-pdf",
    title: "How to Add Page Numbers to a PDF",
    description:
      "Add page numbers to an existing PDF in 30 seconds — bottom-center, bottom-right, or any position. Format as 1, 2, 3 or Page 1 of 60.",
    category: "PDF editing",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/edit-pdf",
    primaryToolLabel: "Open the PDF editor",
    relatedToolSlugs: ["edit-pdf", "merge-pdf", "split-pdf"],
    relatedPostSlug: "how-to-extract-pages-from-pdf",
    answer:
      "Open the PDF in our editor, choose page-number position (bottom-center, bottom-right, top-right), pick a format (1 / 2 / 3 or Page 1 of N), and apply. You can start numbering from any page (e.g., Roman numerals for the first 4 pages, then Arabic 1 from page 5).",
    howToSteps: [
      { name: "Upload your PDF", text: "Drop the report, contract, or book draft." },
      { name: "Pick position", text: "Bottom-center is conventional. Bottom-right is common in legal." },
      { name: "Pick format", text: "1, 2, 3 — or Page 1 of N for double-sided documents." },
      { name: "Set start page (optional)", text: "Skip front matter or use Roman numerals for the first few pages." },
      { name: "Apply", text: "Page numbers are written into the PDF and stay with the file." },
    ],
    body: [
      { type: "h2", text: "Where to put page numbers" },
      { type: "ul", items: [
        "Bottom-center: academic papers, books, reports — most common",
        "Bottom-right: legal filings, contracts",
        "Top-right: technical documentation, software manuals",
        "Bottom-left: avoid — conflicts with margin notes in some templates",
      ] },
      { type: "h2", text: "Common formats" },
      { type: "ul", items: [
        "Plain Arabic: 1, 2, 3",
        "Page label: Page 1, Page 2",
        "X of Y: Page 1 of 60 — useful for double-sided printing",
        "Roman numerals: i, ii, iii — used for prefatory matter",
        "Custom prefix: Section A.1, A.2 — multi-section documents",
      ] },
      { type: "h2", text: "When to skip pages" },
      { type: "p", text: "Title pages, tables of contents, and acknowledgements are usually unnumbered or numbered with Roman numerals separately from the main text. Most authors use Roman i–iv for front matter, then Arabic 1 starting on the first page of Chapter 1. Set the start page to 5 (or wherever main content begins) to skip the front matter." },
      { type: "h2", text: "Don't double up" },
      { type: "p", text: "If your PDF was printed from Word with page numbers in the footer already, adding more produces two sets. Either remove the existing footer first using our PDF editor, or skip the affected pages in the new numbering." },
    ],
    faq: [
      { q: "Can I number only pages 5–60 and leave 1–4 unnumbered?", a: "Yes — exclude pages 1–4 in the numbering options. Common pattern for reports with title page and TOC." },
      { q: "How do I use Roman numerals for the front matter?", a: "Apply numbering twice: first pass Roman numerals on pages 1–4, second pass Arabic numbers from page 5 onwards." },
      { q: "Will the numbers print correctly?", a: "Yes — they're embedded as text in the PDF and print exactly where placed." },
    ],
  },
  {
    slug: "how-to-extract-pages-from-pdf",
    title: "How to Extract Pages from a PDF",
    description:
      "Pull specific pages out of a PDF into a new file. Single page, range, or non-contiguous selection — fast in your browser.",
    category: "PDF editing",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/split-pdf",
    primaryToolLabel: "Open Split PDF",
    relatedToolSlugs: ["split-pdf", "merge-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-add-page-numbers-to-pdf",
    answer:
      "Upload your PDF, select pages by number (e.g., '5, 7-12, 20') or by clicking thumbnails, and download a new PDF with just those pages. Original is preserved. Ordering is whatever you specify — useful when you want to re-sequence.",
    howToSteps: [
      { name: "Upload the source PDF", text: "Drop the file with the pages you need." },
      { name: "Select pages", text: "Type page numbers or click thumbnails." },
      { name: "Extract", text: "We assemble a new PDF with just those pages." },
      { name: "Download", text: "Save the new file — usually much smaller than the original." },
    ],
    body: [
      { type: "h2", text: "Three patterns of extraction" },
      { type: "ul", items: [
        "Single page: 'page 7' — useful for pulling one form out of a packet",
        "Range: 'pages 5–10' — useful for review-only sections of a contract",
        "Non-contiguous: '1, 3, 5, 12–15' — useful for custom selections",
      ] },
      { type: "h2", text: "Extract vs. split vs. remove" },
      { type: "p", text: "All three live in the same toolbox but mean different things. Extract: keep specific pages, output one new PDF. Split: divide into multiple files (one per page or range). Remove: keep everything except the pages you specify. Pick by what your output should look like." },
      { type: "h2", text: "Order matters" },
      { type: "p", text: "Pages come out in the order you specified. Listing 5, 1, 7 produces a PDF with page 5 first, then 1, then 7. This is useful for re-sequencing without a separate merge step." },
      { type: "h2", text: "What survives extraction" },
      { type: "ul", items: [
        "Page content (text, images, fonts): preserved bit-for-bit",
        "Internal links between extracted pages: preserved",
        "Internal links to non-extracted pages: stripped (rather than left dangling)",
        "Form fields on extracted pages: functional in the new file",
        "Bookmarks: pruned to only point at extracted pages",
      ] },
    ],
    faq: [
      { q: "What's the difference between extract and split?", a: "Split divides the PDF into multiple files. Extract pulls specific pages into a single new file. Same source tool." },
      { q: "Can I reorder while extracting?", a: "Yes — list page numbers in the order you want them in the output." },
      { q: "Does extraction lower quality?", a: "No — pages keep original quality bit-for-bit." },
    ],
  },
  {
    slug: "gmail-attachment-size-limit-explained",
    title: "Gmail Attachment Size Limit — and How to Send Bigger Files",
    description:
      "Gmail caps attachments at 25 MB, but base64 encoding inflates files ~33% in transit. Real-world limit is closer to 18 MB on disk. Compression and Drive integration explained.",
    category: "PDF editing",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/compress-pdf",
    primaryToolLabel: "Compress PDF",
    relatedToolSlugs: ["compress-pdf", "split-pdf", "merge-pdf"],
    relatedPostSlug: "pdf-compression-explained-lossy-vs-lossless",
    answer:
      "Gmail limits attachments to 25 MB, but base64 encoding adds ~33% in transit, so files over ~18 MB on disk can hit the limit. To send larger files: compress first, split the PDF if compression isn't enough, or use Gmail's automatic Google Drive integration (Drive link in the email). Outlook 20 MB, Yahoo 25 MB, iCloud 20 MB.",
    howToSteps: [
      { name: "Check the file size", text: "If your PDF is over 18 MB on disk, it'll likely hit Gmail's limit." },
      { name: "Compress", text: "Run our compress tool — most documents shrink 50–80%." },
      { name: "Or use Google Drive link", text: "Gmail offers a Drive upload automatically when an attachment is too big." },
      { name: "For very large PDFs, split", text: "If compression isn't enough, split into two and send in two emails." },
    ],
    body: [
      { type: "h2", text: "The 25 MB number isn't quite the truth" },
      { type: "p", text: "Gmail's documented attachment limit is 25 MB, but that's the encoded size — the size of the file once it's been base64-encoded for email transit. Base64 encoding inflates binary files by roughly 33%. So a 19 MB PDF on your disk becomes ~25 MB in transit and may bounce. Aim for 18 MB or less on disk to be safe." },
      { type: "h2", text: "Limits at other providers" },
      { type: "ul", items: [
        "Gmail: 25 MB encoded (~18 MB on disk)",
        "Outlook.com / Microsoft 365: 20 MB",
        "Yahoo Mail: 25 MB",
        "iCloud Mail: 20 MB",
        "ProtonMail Free: 25 MB",
        "Most enterprise Exchange: 10–20 MB depending on admin policy",
      ] },
      { type: "h2", text: "What gets your PDF over the limit" },
      { type: "ul", items: [
        "High-resolution images embedded at 600 DPI (downsampling to 150 DPI usually fixes it)",
        "Embedded fonts that aren't subset (compression strips unused font glyphs)",
        "Multiple revision histories or comment threads in the PDF metadata",
        "Old PDF versions with redundant XObjects",
        "Scanned documents — usually the biggest offenders, often 10–50 MB for 20 pages",
      ] },
      { type: "h2", text: "Three ways to send big files via Gmail" },
      { type: "ol", items: [
        "Compress the PDF — usually fastest, keeps the email self-contained",
        "Use Gmail's Google Drive integration — it automatically prompts you when an attachment is too big and inserts a Drive link instead",
        "Split the PDF and send in two emails — works for review documents that aren't sequential-dependent",
      ] },
      { type: "h2", text: "When to use a file-share link instead" },
      { type: "p", text: "If your PDF is over 50 MB even after compression, or if you're sending to recipients on tight enterprise email systems (10 MB caps are common), use a Drive / Dropbox / WeTransfer link rather than try to attach. Compressed direct attachments are faster for the recipient when they fit, but a link beats a bounced email every time." },
    ],
    faq: [
      { q: "What's the maximum email attachment size for Gmail?", a: "25 MB encoded. Base64 inflates files ~33%, so plan for 18 MB on disk maximum." },
      { q: "How do I send a PDF larger than 25 MB?", a: "Compress first, or use Gmail's Drive integration which kicks in automatically when the attachment is too big." },
      { q: "Why does Gmail say 'attachment is too big' even though my file is under 25 MB?", a: "Base64 encoding adds ~33% in transit. A 22 MB file on disk hits ~29 MB encoded — over the limit." },
    ],
  },
  {
    slug: "are-electronic-signatures-legally-binding",
    title: "Are Electronic Signatures Legally Binding? A Practical Guide",
    description:
      "Electronic signatures are legally binding for almost all business agreements in the US, EU, UK, Canada, and Australia. ESIGN, eIDAS, and when you still need a wet signature.",
    category: "Business documents",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/sign-pdf",
    primaryToolLabel: "Sign a PDF",
    relatedToolSlugs: ["sign-pdf", "edit-pdf"],
    relatedPostSlug: "how-to-send-an-nda-online-free",
    answer:
      "Yes. In the US (ESIGN Act, 2000), EU (eIDAS, 2014), UK (Electronic Communications Act 2000), Canada (PIPEDA), and Australia (Electronic Transactions Act 1999), electronic signatures have the same legal effect as handwritten ones for almost all business agreements. Exceptions include wills, family law documents, court orders, and some real-estate transactions where wet signatures or notarization are required.",
    body: [
      { type: "h2", text: "The short version" },
      { type: "p", text: "An electronic signature — typed, drawn, or otherwise applied with intent — is legally equivalent to a handwritten signature for almost all business agreements: contracts, NDAs, offer letters, service agreements, leases, vendor agreements, consulting contracts, freelance work, and more. This has been settled law in the US since 2000 (the ESIGN Act) and similarly in the EU, UK, Canada, and Australia." },
      { type: "h2", text: "What makes an e-signature enforceable" },
      { type: "p", text: "Three things, per the ESIGN Act and equivalent laws elsewhere:" },
      { type: "ol", items: [
        "Intent to sign — the signer demonstrably meant to sign (clicking a 'sign' button counts)",
        "Consent to do business electronically — both parties agreed to electronic transactions (opening the document and signing implies this)",
        "Attribution — the signature is associated with the signer, typically through email + audit trail",
      ] },
      { type: "h2", text: "Standard electronic signatures vs. qualified" },
      { type: "p", text: "There are tiers. A 'standard electronic signature' (typed name, drawn signature, click-to-sign) is enforceable for almost all commercial agreements. A 'qualified electronic signature' (eIDAS QES in the EU, equivalent elsewhere) requires a hardware certificate from a trust service provider — only required for narrow regulated cases like signing official EU documents. For 99% of business use, a standard signature is fine." },
      { type: "h2", text: "When you still need a wet signature" },
      { type: "ul", items: [
        "Wills, codicils, and testamentary trusts",
        "Family law documents (adoption, divorce, child custody) in many states",
        "Court orders and notices of court action",
        "Some real-estate transactions (deeds, mortgage documents in select states)",
        "Notarized documents where the notarization itself requires a physical seal (some states allow remote online notarization)",
        "Documents specifically requiring a wet signature by contract (rare; check your agreement)",
      ] },
      { type: "h2", text: "What an audit trail provides" },
      { type: "p", text: "Modern e-signature tools record an audit trail with the signer's email, IP address, view timestamp, and sign timestamp. This is what courts look at if there's ever a dispute — it establishes intent, attribution, and the order of events. A signed PDF without an audit trail is harder to defend." },
      { type: "h2", text: "International recognition" },
      { type: "ul", items: [
        "USA: ESIGN Act (2000) + Uniform Electronic Transactions Act (state-level, 49 of 50 states)",
        "EU: eIDAS Regulation (2014) — standard, advanced, and qualified tiers",
        "UK: Electronic Communications Act 2000 + post-Brexit retention of eIDAS principles",
        "Canada: Personal Information Protection and Electronic Documents Act (PIPEDA)",
        "Australia: Electronic Transactions Act 1999",
        "India: Information Technology Act 2000",
      ] },
    ],
    faq: [
      { q: "Is a typed signature legally valid?", a: "Yes. Typed, drawn, or click-applied signatures all qualify under ESIGN and eIDAS as long as the signer demonstrably intended to sign." },
      { q: "Can I e-sign a contract on my phone?", a: "Yes. Device doesn't matter under ESIGN — phone, tablet, or desktop signatures are equally enforceable." },
      { q: "What about international contracts?", a: "Most major jurisdictions recognize electronic signatures. For deals between multiple countries, your contract usually specifies which country's law governs." },
      { q: "Do I need to print and store the signed PDF?", a: "Not legally — the digital signed PDF with audit trail is the legal record. Store digital copies; print only if you prefer." },
    ],
  },
  {
    slug: "pdf-compression-explained-lossy-vs-lossless",
    title: "PDF Compression Explained — Lossy vs. Lossless",
    description:
      "PDF compression isn't one thing — it's a mix of lossless (always safe) and lossy (visible at high settings) techniques. Here's what each does.",
    category: "PDF editing",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/compress-pdf",
    primaryToolLabel: "Compress PDF",
    relatedToolSlugs: ["compress-pdf", "split-pdf"],
    relatedPostSlug: "gmail-attachment-size-limit-explained",
    answer:
      "Lossless compression removes redundancy (duplicate fonts, metadata, unused objects) without changing how the PDF looks. Lossy compression downsamples images — necessary for big size reductions but visible if pushed too far. Most PDF compressors use both: lossless first, then mild lossy on images. Default settings preserve readable quality.",
    body: [
      { type: "h2", text: "What gets compressed losslessly" },
      { type: "ul", items: [
        "Embedded fonts that aren't subset (we keep only the glyphs actually used)",
        "Document metadata you don't need (Author, Title, Comments history)",
        "Thumbnails (PDF readers regenerate these anyway)",
        "Duplicate XObjects (the same logo embedded 50 times becomes one shared object)",
        "Unused color profiles",
        "Form field defaults that aren't visible",
      ] },
      { type: "h2", text: "What gets compressed lossily" },
      { type: "p", text: "Mostly images. Photos and scanned pages are downsampled — typically from 300+ DPI to 150 DPI for screen-quality output. JPEG quality is also lowered slightly (e.g., from 95 to 75 on the 0–100 scale). Both are visible if pushed too aggressively, but at default settings the difference is hard to spot at normal zoom." },
      { type: "h2", text: "What never gets touched" },
      { type: "ul", items: [
        "Text: stays as vector text, crisp at any zoom",
        "Vector graphics (logos, line art, shapes): not rasterized",
        "Form fields: preserved",
        "Annotations and comments: preserved",
        "Bookmarks and links: preserved",
        "Digital signatures: preserved (compression after signing breaks the signature)",
      ] },
      { type: "h2", text: "Realistic size reductions" },
      { type: "ul", items: [
        "Image-heavy reports / presentations / scanned documents: 50–80% smaller",
        "Mixed text-and-image: 20–40% smaller",
        "Pure text PDFs (Word doc exported as PDF): often already optimized — 5–15% reduction is the most you'll get",
      ] },
      { type: "h2", text: "When to skip compression" },
      { type: "ul", items: [
        "PDFs going to commercial print (offset, high-DPI digital): always send the original",
        "Documents under 1 MB: usually not worth the effort",
        "Already-compressed PDFs: re-compressing produces little benefit and can introduce visible artifacts",
        "PDFs with digital signatures: compressing breaks the signature",
      ] },
    ],
    faq: [
      { q: "Will I see a quality drop after compression?", a: "Default settings preserve readable quality. Text stays crisp; photos may be slightly softer at extreme zoom but look normal at standard viewing." },
      { q: "Can I undo compression?", a: "No — compression is destructive (for the lossy part). Always keep the original." },
      { q: "Does compression remove signatures?", a: "Compressing a digitally signed PDF breaks the signature. Sign after compressing if you need both." },
    ],
  },
  {
    slug: "ocr-explained-when-you-need-it",
    title: "OCR Explained — What It Is and When You Need It",
    description:
      "OCR converts images of text into real text. When to use it (scanned PDFs, photos of documents) and when not to (already-text PDFs).",
    category: "PDF conversion",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/ocr-pdf",
    primaryToolLabel: "OCR a PDF",
    relatedToolSlugs: ["ocr-pdf", "pdf-to-word", "edit-pdf"],
    relatedPostSlug: "how-to-redact-a-pdf",
    answer:
      "OCR (Optical Character Recognition) takes an image of text — a scan, a phone photo of a page, an image-only PDF — and turns it into real, selectable, searchable text. You need OCR when you can't select text in a PDF with your cursor (it's an image, not text). You don't need OCR if text in the PDF is already selectable.",
    body: [
      { type: "h2", text: "How to tell if you need OCR" },
      { type: "p", text: "Open the PDF and try to select text with your cursor. If you can highlight individual words, the PDF already has text — OCR isn't needed. If your cursor only selects whole pages or rectangular regions, the PDF is image-only and OCR is what makes it searchable and editable." },
      { type: "h2", text: "Common cases that need OCR" },
      { type: "ul", items: [
        "Scanned paper documents (legal records, old contracts, medical records)",
        "Phone-camera photos of paper, exported as PDF",
        "PDFs from older photocopiers that scan-to-PDF as image",
        "Faxes converted to PDF",
        "Screenshots of text saved as PDF",
        "Books or articles you scanned page by page",
      ] },
      { type: "h2", text: "What OCR does technically" },
      { type: "p", text: "An OCR engine (like Tesseract, which we use) examines each page image, identifies character shapes, and matches them against a trained model for the document's language. The output is plain text in reading order. We then layer that text invisibly behind the original image, so the PDF still looks identical but is now searchable, copy-paste-able, and convertible to Word." },
      { type: "h2", text: "Languages and accuracy" },
      { type: "p", text: "Tesseract supports 100+ languages; we expose 25 most-common. Pick the right one — OCR'ing English text with the Spanish model produces gibberish. For multilingual documents, select multiple languages and the engine handles them together." },
      { type: "h2", text: "Accuracy at different scan quality" },
      { type: "ul", items: [
        "Clean printed text at 300 DPI: 99%+ accuracy",
        "Phone-camera scans (lighting, angle): 90–95% accuracy",
        "Old typewriter or low-contrast scans: 85–90%",
        "Handwriting (block letters, neat): 70–80%",
        "Cursive handwriting: 50–70% — usually requires manual correction",
      ] },
      { type: "h2", text: "Two-step workflow with OCR" },
      { type: "ol", items: [
        "Scan or upload your document as a PDF",
        "Run OCR — turns the image into a searchable PDF",
        "Optional: convert OCR'd PDF to Word for editing, or use it directly for search/copy/paste",
      ] },
    ],
    faq: [
      { q: "How accurate is OCR?", a: "99%+ for clean printed text at 300 DPI. Phone-camera scans drop to 90–95%. Handwriting is 60–80% depending on neatness." },
      { q: "Can I OCR handwriting?", a: "For clear printed-style handwriting, yes. Cursive is hard. Expect to manually correct some words." },
      { q: "What if my document has multiple languages?", a: "Pick all the languages present — Tesseract handles multilingual OCR well." },
    ],
  },
  {
    slug: "how-to-send-an-nda-online-free",
    title: "How to Send an NDA Online for Free",
    description:
      "Send a non-disclosure agreement to the other party for online signature — free up to 10 envelopes/month, audit trail included, no DocuSign account.",
    category: "Business documents",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/send-for-signature",
    primaryToolLabel: "Send for signature",
    relatedToolSlugs: ["send-for-signature", "sign-pdf", "edit-pdf"],
    relatedPostSlug: "are-electronic-signatures-legally-binding",
    answer:
      "Upload your NDA, add the counterparty's name and email, drag a signature field onto their signature line, and click send. They get a private link in their email, sign in their browser without an account, and the fully-signed NDA is emailed back to you with an audit certificate. Free up to 10 envelopes per month.",
    howToSteps: [
      { name: "Upload your NDA", text: "Drop your NDA PDF — mutual, one-way, or any custom version." },
      { name: "Add the counterparty", text: "Enter their name and email. Add yourself as a second recipient if it's a mutual NDA." },
      { name: "Drag fields", text: "Place a signature field on each signer's signature line. Add a date field if needed." },
      { name: "Send", text: "Each party gets a private link. You'll be notified when each signs." },
    ],
    body: [
      { type: "h2", text: "What a typical NDA flow looks like" },
      { type: "p", text: "You're working with a freelancer, contractor, or potential hire and want them to sign an NDA before sharing confidential info. Old way: print, sign, scan, email, wait, print again, scan again. New way: send via e-signature in 60 seconds." },
      { type: "h2", text: "One-way vs. mutual NDAs" },
      { type: "ul", items: [
        "One-way NDA: only one party shares confidential info (typical when you're hiring a freelancer). Only the recipient signs.",
        "Mutual NDA: both parties exchange confidential info (typical for partnerships, joint ventures). Both parties sign.",
      ] },
      { type: "h2", text: "Step by step" },
      { type: "ol", items: [
        "Open the send-for-signature tool",
        "Upload your NDA PDF",
        "Set the envelope subject: 'NDA — [YourCompany] / [TheirCompany]'",
        "Add a personal message: 'Hi Sarah, here's the NDA we discussed. Standard mutual terms.'",
        "Add recipients: counterparty (and yourself for mutual)",
        "Drag signature fields onto each signer's line",
        "Send",
      ] },
      { type: "h2", text: "What the recipient sees" },
      { type: "p", text: "An email titled '[YourName] sent you an NDA to sign'. They click the link, see the NDA in their browser, sign by typing or drawing, and submit. No account, no app, no install. Free for them, free for you (up to 10 envelopes/month)." },
      { type: "h2", text: "What you get" },
      { type: "ul", items: [
        "Real-time status: sent → viewed → signed",
        "Email notification when each party signs",
        "Final signed PDF with audit certificate (envelope ID, signer name + email, view + sign timestamps, IP address)",
        "Both parties get the signed PDF emailed automatically",
      ] },
      { type: "h2", text: "Reminders if they're slow" },
      { type: "p", text: "If they haven't signed in a day or two, click 'Remind' on the envelope page. We'll re-send the invite. Rate-limited to one reminder per recipient per hour to keep it polite." },
    ],
    faq: [
      { q: "Is the NDA legally binding when signed this way?", a: "Yes — same legal weight as a wet signature for standard business NDAs under U.S. ESIGN Act and EU eIDAS." },
      { q: "Does the counterparty need an account?", a: "No — they sign in their browser via a private link. No MyPDFKitty signup needed." },
      { q: "What if they want to negotiate the terms?", a: "They can decline to sign with an optional reason. You'll be notified, send a revised PDF, start a new envelope." },
      { q: "How many NDAs can I send per month?", a: "10 free. Plus increases to 50, Pro to 200, Business to 1,000." },
    ],
  },
  {
    slug: "how-to-fill-out-w9-online",
    title: "How to Fill Out a W-9 Online",
    description:
      "Fill out IRS Form W-9 online and send it to the requester. No printing, no scanning. Works on any browser, free.",
    category: "Business documents",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/edit-pdf",
    primaryToolLabel: "Open PDF editor",
    relatedToolSlugs: ["edit-pdf", "sign-pdf", "compress-pdf"],
    relatedPostSlug: "are-electronic-signatures-legally-binding",
    answer:
      "Download the latest W-9 from IRS.gov, open it in our PDF editor, click each field and type your information (name, business name if applicable, tax classification, address, TIN/SSN), sign electronically, and email back to the requester. The IRS-provided W-9 is fillable, so most fields accept input directly.",
    howToSteps: [
      { name: "Get the latest W-9", text: "Download Form W-9 from IRS.gov — always use the current version." },
      { name: "Open in our editor", text: "Drop the PDF into our editor. We auto-detect the fillable fields." },
      { name: "Fill the fields", text: "Click each field and type. Pick your tax classification (Individual / Sole Prop / LLC / Corporation)." },
      { name: "Sign and date", text: "Add your electronic signature on the signature line and today's date." },
      { name: "Email back", text: "Save and email to the requester." },
    ],
    body: [
      { type: "h2", text: "What a W-9 actually does" },
      { type: "p", text: "A W-9 is the IRS form that businesses use to collect your taxpayer identification number (TIN) — your SSN if you're an individual, or your EIN if you have a business. The requester needs it to issue you a 1099 at year end if they paid you $600 or more. Filling out a W-9 doesn't trigger any tax event; it just records who you are." },
      { type: "h2", text: "Sections explained" },
      { type: "ul", items: [
        "Line 1 — Name: your legal name as it appears on your tax return",
        "Line 2 — Business name: only if you have a separate business name (DBA)",
        "Line 3 — Federal tax classification: Individual / Sole Prop / C Corp / S Corp / Partnership / LLC / Trust",
        "Line 4 — Exemptions: usually blank for individuals",
        "Lines 5–6 — Address: where the requester will mail the 1099",
        "Part I — TIN: SSN for individuals, EIN for businesses",
        "Part II — Certification: signature + date",
      ] },
      { type: "h2", text: "Common mistakes" },
      { type: "ul", items: [
        "Using the wrong year's W-9 (always use the current IRS version)",
        "Filling in 'Business name' when you don't have one (leave Line 2 blank)",
        "Putting EIN where SSN goes (or vice versa) — match what you actually have registered with the IRS",
        "Forgetting to sign — unsigned W-9s are returned",
      ] },
      { type: "h2", text: "Privacy" },
      { type: "p", text: "W-9s contain your SSN, which is sensitive. Send via secure email (encrypted), the requester's secure portal, or password-protect the PDF before sending. Don't text or send via DM." },
    ],
    faq: [
      { q: "Is an electronically signed W-9 valid?", a: "Yes — the IRS accepts e-signed W-9s. The requester is responsible for retaining the signed copy." },
      { q: "Do I need to send it back via secure channel?", a: "Yes — W-9 contains your SSN. Use secure email or the requester's portal, not regular email." },
      { q: "Can I save my W-9 to reuse?", a: "Yes — many freelancers keep a signed W-9 PDF on file and re-send for each new client." },
    ],
  },
  {
    slug: "how-to-merge-resume-and-cover-letter",
    title: "How to Merge a Resume and Cover Letter into One PDF",
    description:
      "Combine your resume and cover letter into a single PDF for job applications. ATS-friendly, fits 5 MB portal caps, in 30 seconds.",
    category: "Student PDFs",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/merge-pdf",
    primaryToolLabel: "Merge PDF",
    relatedToolSlugs: ["merge-pdf", "compress-pdf", "pdf-to-word"],
    relatedPostSlug: "how-to-fill-out-w9-online",
    answer:
      "Save your cover letter and resume as separate PDFs, drop them into our merge tool with the cover letter first and resume second, and download the combined PDF. ATS systems parse merged PDFs correctly. Name the file 'FirstName_LastName_Resume.pdf' before uploading to a job portal.",
    howToSteps: [
      { name: "Save each as PDF", text: "Cover letter as PDF, resume as PDF. Use 'Save As → PDF' from Word or Google Docs." },
      { name: "Open Merge PDF", text: "Drop the cover letter first, then the resume." },
      { name: "Merge", text: "We combine into a single PDF preserving each page exactly." },
      { name: "Rename", text: "FirstName_LastName_Resume.pdf — recruiter-friendly format." },
      { name: "Upload", text: "Submit through the job portal." },
    ],
    body: [
      { type: "h2", text: "When to merge — and when not to" },
      { type: "p", text: "Merge if the application has one upload field for 'Resume' or 'Application' and the instructions say to include a cover letter. Don't merge if there are separate upload fields for resume and cover letter — keep them separate. When in doubt, separate is safer." },
      { type: "h2", text: "The right order" },
      { type: "ul", items: [
        "Cover letter first (page 1) — recruiters see it first when they open the PDF",
        "Resume second (pages 2–3) — the meat of your application",
        "References / supporting docs last — only if requested",
      ] },
      { type: "p", text: "Some senior-role recruiters prefer resume first since they skim resumes more aggressively. Use your judgment based on the role." },
      { type: "h2", text: "ATS compatibility" },
      { type: "p", text: "Modern ATS (Workday, Greenhouse, Lever, Taleo) parse multi-page merged PDFs correctly as long as text stays as text — not images. Don't worry about merging breaking parsing; it doesn't." },
      { type: "h2", text: "File size" },
      { type: "ul", items: [
        "Most resume + cover letter PDFs are under 1 MB",
        "Most job ATS portals cap at 5 MB",
        "If your merged file exceeds 5 MB, you have a high-res photo or large image — compress before uploading",
      ] },
      { type: "h2", text: "Filename matters" },
      { type: "p", text: "Use 'FirstName_LastName_Resume.pdf' or 'FirstName_LastName_Application.pdf'. Avoid spaces (some systems mangle them) and skip 'final', 'v2', 'updated', which look unprofessional. Many recruiters search their inbox by filename — yours should be searchable." },
    ],
    faq: [
      { q: "Will an ATS parse my merged PDF correctly?", a: "Yes — every modern ATS parses multi-page PDFs as long as text is selectable (not an image). Merging doesn't break that." },
      { q: "Should I send cover letter and resume as one or separate?", a: "Follow the application's instructions. If unsure, separate is safer." },
      { q: "What's the best filename for a resume?", a: "FirstName_LastName_Resume.pdf — recruiter-friendly and searchable." },
    ],
  },
  {
    slug: "how-to-make-a-pdf-searchable",
    title: "How to Make a PDF Searchable (Even Scanned Ones)",
    description:
      "Make a PDF searchable by running OCR — turns image-only scans into text you can search, copy, and edit. 25 languages supported, free in your browser.",
    category: "PDF conversion",
    publishedAt: "2026-05-01",
    primaryToolHref: "/tools/ocr-pdf",
    primaryToolLabel: "Run OCR",
    relatedToolSlugs: ["ocr-pdf", "pdf-to-word", "edit-pdf"],
    relatedPostSlug: "ocr-explained-when-you-need-it",
    answer:
      "Open the PDF in our OCR tool, pick the language(s) of the document, and run OCR. We extract the text and layer it invisibly behind the original page image — the PDF looks identical but is now searchable, copy-paste-able, and convertible to Word. Works for scanned documents, phone-camera PDFs, and any image-only PDF.",
    howToSteps: [
      { name: "Upload the PDF", text: "Drop the scanned document or image-only PDF." },
      { name: "Pick languages", text: "English by default. Add other languages if the document is multilingual." },
      { name: "Run OCR", text: "We process each page and extract text in reading order." },
      { name: "Download searchable PDF", text: "Same visual file, now with selectable, searchable text underneath." },
    ],
    body: [
      { type: "h2", text: "Why searchability matters" },
      { type: "ul", items: [
        "Cmd/Ctrl+F to find specific terms (instead of skimming 50 pages)",
        "Copy quotes for citations or summaries",
        "Convert to Word for editing",
        "Run AI summary or chat-with-PDF on the content",
        "Index in document management systems (SharePoint, Google Drive, Notion)",
      ] },
      { type: "h2", text: "How searchable PDFs work" },
      { type: "p", text: "A searchable PDF has two layers per page: the original page image (what you see) and an invisible text layer underneath (what your computer reads). When you select text or search, you're interacting with the invisible layer. Visually, the PDF looks identical to the scan — same fonts, same layout, same imperfections — but it's now machine-readable." },
      { type: "h2", text: "What OCR does behind the scenes" },
      { type: "p", text: "OCR (Optical Character Recognition) is a machine-learning model trained on millions of pages of text in different fonts, sizes, and languages. It identifies character shapes in your scan and matches them to letters and words. Modern OCR (we use Tesseract, the open-source standard) hits 99%+ accuracy on clean printed text at 300 DPI." },
      { type: "h2", text: "Languages we support" },
      { type: "p", text: "25 languages including English, Spanish, French, German, Italian, Portuguese, Dutch, Russian, Polish, Turkish, Arabic, Hindi, Bengali, Chinese (Simplified + Traditional), Japanese, Korean, Vietnamese, Thai, and more. Pick the language(s) the document is written in — picking the wrong one produces gibberish." },
      { type: "h2", text: "After OCR" },
      { type: "ul", items: [
        "Search — Cmd/Ctrl+F finds any term in the document",
        "Copy/paste — select text and paste into Word, email, etc.",
        "Convert to Word — run our PDF-to-Word tool to get an editable .docx",
        "AI summary — run our AI summarizer on the OCR'd content",
        "Edit — drop new text fields or annotations using our edit-pdf tool",
      ] },
    ],
    faq: [
      { q: "Will OCR change how my PDF looks?", a: "No — the original page images stay intact. OCR adds a hidden text layer underneath." },
      { q: "Is OCR accurate?", a: "99%+ on clean printed text at 300 DPI. Phone-camera scans drop to 90–95%. Handwriting is harder (60–80%)." },
      { q: "Does OCR work on multi-page PDFs?", a: "Yes — every page gets processed independently. Free up to 25 MB; Pro up to 250 MB." },
    ],
  },
];


// Helper used by the language-pair posts above. Generated programmatically
// so we can ship 10+ posts without duplicating boilerplate.
function buildTranslationPost(
  fromSlug: string, toSlug: string, fromName: string, toName: string,
): BlogPost[] {
  const slug = `how-to-translate-${fromSlug}-pdf-to-${toSlug}`;
  return [{
    slug,
    title: `How to Translate ${fromName} PDF to ${toName} Online Free`,
    description: `Convert a ${fromName} PDF into ${toName} online for free with AI. Step-by-step guide using MyPDFKitty.`,
    category: "AI PDF",
    publishedAt: "2026-03-01",
    primaryToolHref: `/tools/translate-pdf/${fromSlug}-to-${toSlug}`,
    primaryToolLabel: `Translate ${fromName} to ${toName}`,
    relatedToolSlugs: ["translate-pdf", "ocr-pdf", "ai-summarizer", "chat-pdf"],
    relatedPostSlug: "how-to-summarize-a-pdf-with-ai",
    answer:
      `To translate a ${fromName} PDF to ${toName} online for free, open MyPDFKitty's Translate PDF tool, upload your file, choose ${fromName} as the source and ${toName} as the target, and click Translate. We extract the text and use AI to translate it; copy the result or download a .txt file.`,
    howToSteps: [
      { name: `Open Translate ${fromName} → ${toName}`, text: `Go to MyPDFKitty's free ${fromName} to ${toName} translator.` },
      { name: `Upload your ${fromName} PDF`, text: `Drop the PDF onto the upload box.` },
      { name: "Translate", text: `Pick ${fromName} as the source and ${toName} as the target, then click Translate.` },
      { name: "Read or download", text: `Copy the ${toName} translation or save it as a .txt file.` },
    ],
    body: [
      { type: "h2", text: "When to use this" },
      { type: "ul", items: [
        `You received a ${fromName} contract or letter and need to read it in ${toName}.`,
        `You're studying ${fromName}-language coursework or research papers.`,
        `You're sending a ${fromName} draft to a ${toName}-speaking colleague.`,
      ] },
      { type: "callout", text: `Scanned PDF? Run OCR PDF first to extract the ${fromName} text — it works for ${fromName} and 25+ other languages right in your browser.` },
      { type: "h2", text: "Common problems" },
      { type: "ul", items: [
        "Layout flattens — paragraphs are preserved, but tables, columns, and headers may need manual fixes.",
        "Specialized terminology (legal, medical) — always have a native speaker review before signing or publishing.",
      ] },
    ],
    faq: [
      { q: "Is the translation accurate?", a: "Modern AI translation handles everyday text well. For legal, medical, or technical content, have a native speaker review the result." },
      { q: "Is it really free?", a: "Free users get 1 translation per month. Paid plans (Kitty Plus from $2.99/mo) include 25–250 translations per month." },
      { q: "What about scanned PDFs?", a: `Run OCR PDF first to extract the ${fromName} text, then translate. OCR runs in your browser and is also free.` },
    ],
  }];
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    (b.updatedAt ?? b.publishedAt).localeCompare(a.updatedAt ?? a.publishedAt),
  );
}

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
