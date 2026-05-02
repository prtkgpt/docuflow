import {
  FileEdit,
  FileArchive,
  FilesIcon,
  Scissors,
  RotateCw,
  PenTool,
  Highlighter,
  Trash2,
  FileOutput,
  Layers,
  Lock,
  Unlock,
  FileType2,
  Image as ImageIcon,
  Sheet,
  Presentation,
  FileText,
  FilePlus2,
  Code2,
  Sparkles,
  MessagesSquare,
  ListChecks,
  Languages,
  ScanText,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory = "edit" | "from-pdf" | "to-pdf" | "ai" | "image";

export type Tool = {
  slug: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  categories: ToolCategory[];
  pro?: boolean;
};

export const TOOLS: Tool[] = [
  // Edit & Sign
  { slug: "edit-pdf", name: "Edit PDF", description: "Add text, images, highlights and more.", href: "/tools/edit-pdf", icon: FileEdit, categories: ["edit"] },
  { slug: "compress-pdf", name: "Compress PDF", description: "Shrink PDFs while keeping quality.", href: "/tools/compress-pdf", icon: FileArchive, categories: ["edit"] },
  { slug: "merge-pdf", name: "Merge PDF", description: "Combine multiple PDFs into one file.", href: "/tools/merge-pdf", icon: FilesIcon, categories: ["edit"] },
  { slug: "split-pdf", name: "Split PDF", description: "Extract pages or split into multiple PDFs.", href: "/tools/split-pdf", icon: Scissors, categories: ["edit"] },
  { slug: "rotate-pdf", name: "Rotate PDF", description: "Rotate selected pages 90, 180 or 270 degrees.", href: "/workspace?tool=rotate", icon: RotateCw, categories: ["edit"] },
  { slug: "sign-pdf", name: "Sign PDF", description: "Add typed, drawn, or uploaded signatures.", href: "/tools/sign-pdf", icon: PenTool, categories: ["edit"] },
  { slug: "annotate-pdf", name: "Annotate PDF", description: "Add notes, highlights and text boxes.", href: "/editor", icon: Highlighter, categories: ["edit"] },
  { slug: "delete-pages", name: "Delete Pages", description: "Remove pages you don't need.", href: "/workspace?tool=delete", icon: Trash2, categories: ["edit"] },
  { slug: "extract-pages", name: "Extract Pages", description: "Pull selected pages into a new PDF.", href: "/workspace?tool=extract", icon: FileOutput, categories: ["edit"] },
  { slug: "organize-pdf", name: "Organize PDF", description: "Reorder, rotate and remove pages visually.", href: "/workspace?tool=organize", icon: Layers, categories: ["edit"] },
  { slug: "protect-pdf", name: "Password Protect", description: "Add a password to your PDF.", href: "/workspace?tool=protect", icon: Lock, categories: ["edit"], pro: true },
  { slug: "unlock-pdf", name: "Unlock PDF", description: "Remove the password from a PDF.", href: "/workspace?tool=unlock", icon: Unlock, categories: ["edit"], pro: true },

  // Convert from PDF
  { slug: "pdf-to-word", name: "PDF to Word", description: "Convert PDF documents to editable .docx.", href: "/tools/pdf-to-word", icon: FileType2, categories: ["from-pdf"] },
  { slug: "pdf-to-jpg", name: "PDF to JPG", description: "Render each PDF page as a JPG image.", href: "/tools/pdf-to-jpg", icon: ImageIcon, categories: ["from-pdf", "image"] },
  { slug: "pdf-to-png", name: "PDF to PNG", description: "Render each PDF page as a PNG image.", href: "/tools/pdf-to-jpg?format=png", icon: ImageIcon, categories: ["from-pdf", "image"] },
  { slug: "pdf-to-excel", name: "PDF to Excel", description: "Extract tabular data into .xlsx.", href: "/tools/pdf-to-word?type=excel", icon: Sheet, categories: ["from-pdf"], pro: true },
  { slug: "pdf-to-pptx", name: "PDF to PPTX", description: "Convert PDF slides into PowerPoint.", href: "/tools/pdf-to-word?type=pptx", icon: Presentation, categories: ["from-pdf"], pro: true },
  { slug: "pdf-to-text", name: "PDF to Text", description: "Extract plain text from your PDF.", href: "/tools/ai-pdf-summarizer?mode=extract", icon: FileText, categories: ["from-pdf"] },

  // Convert to PDF
  { slug: "word-to-pdf", name: "Word to PDF", description: "Convert .doc/.docx into PDF.", href: "/tools/word-to-pdf", icon: FilePlus2, categories: ["to-pdf"] },
  { slug: "jpg-to-pdf", name: "JPG to PDF", description: "Combine images into one PDF.", href: "/tools/jpg-to-pdf", icon: FilePlus2, categories: ["to-pdf", "image"] },
  { slug: "png-to-pdf", name: "PNG to PDF", description: "Convert PNG images to a PDF.", href: "/tools/jpg-to-pdf?format=png", icon: FilePlus2, categories: ["to-pdf", "image"] },
  { slug: "excel-to-pdf", name: "Excel to PDF", description: "Convert spreadsheets to PDF.", href: "/tools/word-to-pdf?type=excel", icon: Sheet, categories: ["to-pdf"], pro: true },
  { slug: "pptx-to-pdf", name: "PPTX to PDF", description: "Export PowerPoint decks as PDF.", href: "/tools/word-to-pdf?type=pptx", icon: Presentation, categories: ["to-pdf"], pro: true },
  { slug: "html-to-pdf", name: "HTML to PDF", description: "Render web pages or HTML to PDF.", href: "/tools/word-to-pdf?type=html", icon: Code2, categories: ["to-pdf"] },

  // AI Tools
  { slug: "ai-summarizer", name: "AI PDF Summarizer", description: "Get short summaries, key points and actions.", href: "/tools/ai-pdf-summarizer", icon: Sparkles, categories: ["ai"], pro: true },
  { slug: "chat-pdf", name: "Chat with PDF", description: "Ask questions about your document.", href: "/tools/ai-pdf-summarizer?mode=chat", icon: MessagesSquare, categories: ["ai"], pro: true },
  { slug: "key-points", name: "Extract Key Points", description: "Pull the most important takeaways.", href: "/tools/ai-pdf-summarizer?mode=keypoints", icon: ListChecks, categories: ["ai"], pro: true },
  { slug: "translate-pdf", name: "Translate PDF", description: "Translate the contents of your PDF.", href: "/tools/ai-pdf-summarizer?mode=translate", icon: Languages, categories: ["ai"], pro: true },
  { slug: "ocr-pdf", name: "OCR PDF", description: "Make scanned PDFs searchable.", href: "/tools/ocr-pdf", icon: ScanText, categories: ["ai"] },
];

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  edit: "Edit & Sign",
  "from-pdf": "Convert from PDF",
  "to-pdf": "Convert to PDF",
  ai: "AI Tools",
  image: "Image Tools",
};

export function toolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.categories.includes(category));
}

export function findTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}
