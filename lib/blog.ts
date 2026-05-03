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
