import { ToolPage } from "@/components/ToolPageLayout";
import { TranslateRunner } from "@/components/tools/TranslateRunner";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Translate PDF Online Free – AI Translation in 25+ Languages | MyPDFKitty",
  description:
    "Translate PDFs online with AI. Auto-detect or pick a source language and translate to English, Spanish, French, Hindi, Chinese, Arabic, and 20+ more — free.",
  path: "/tools/translate-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="translate-pdf"
      h1="Translate PDF Online Free"
      intro="Translate PDFs to and from 25+ languages using AI. Upload a PDF, pick the source and target languages, and get a clean translated text you can copy or download. Best for text-based PDFs; for scans, run OCR PDF first."
      runner={<TranslateRunner />}
      metaTitle="Translate PDF Online Free – AI Translation in 25+ Languages | MyPDFKitty"
      metaDescription="Translate PDFs online with AI. Auto-detect or pick a source language and translate to English, Spanish, French, Hindi, Chinese, Arabic, and 20+ more — free."
      steps={[
        { name: "Upload your PDF", text: "Drop the PDF you want to translate." },
        { name: "Pick languages", text: "Auto-detect or choose the source, then pick the target language." },
        { name: "Translate", text: "We extract the text, translate it via AI, and show the result. Copy it or download as .txt." },
      ]}
      whenToUse={[
        "Reading a contract or research paper that's not in your language.",
        "Sending a translated draft to an international client.",
        "Studying foreign-language coursework.",
        "Quickly understanding a scanned receipt or letter (after running OCR).",
      ]}
      relatedToolSlugs={["ocr-pdf", "ai-summarizer", "chat-pdf", "pdf-to-word"]}
      relatedBlogSlugs={[
        { slug: "how-to-translate-pdf-online-free", title: "How to translate a PDF online (free)" },
      ]}
      faq={[
        { q: "Does it preserve formatting?", a: "We preserve paragraph breaks and lists. Tables, headers, and complex layouts may flatten — copy into your editor of choice for the final layout pass." },
        { q: "Is it free?", a: "Free users get 1 translation per month. Paid plans include 25–250 per month, same allowance as AI summaries." },
        { q: "What about scans?", a: "Run OCR PDF first to extract text, then translate. OCR runs entirely in your browser and is also free." },
      ]}
    />
  );
}
