import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Chat With PDF – Ask Questions About Your PDF | MyPDFKitty",
  description:
    "Chat with your PDF using AI. Upload a document, ask questions, and get clear answers based on the file content.",
  path: "/tools/chat-with-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="chat-with-pdf"
      h1="Chat With PDF"
      intro="Ask questions about a PDF and get answers grounded in the document. Upload a contract, research paper, or report and chat with it like you'd chat with a teammate."
      uploadRedirect="/editor?tool=chat"
      metaTitle="Chat With PDF – Ask Questions About Your PDF | MyPDFKitty"
      metaDescription="Chat with your PDF using AI. Upload a document, ask questions, and get clear answers based on the file content."
      steps={[
        { name: "Upload your PDF", text: "Drop the document you want to chat with." },
        { name: "Ask a question", text: "Type a question in plain English. Be specific for best results." },
        { name: "Read the answer", text: "MyPDFKitty answers using only the document and cites the pages it used." },
      ]}
      whenToUse={[
        "Pulling specific terms out of a long contract.",
        "Asking 'what's the methodology?' on a research paper.",
        "Finding a number buried in a financial report.",
        "Drafting an email reply based on a long PDF you just received.",
      ]}
      relatedToolSlugs={["ai-summarizer", "key-points", "ocr-pdf", "edit-pdf"]}
      relatedBlogSlugs={[
        { slug: "how-to-chat-with-a-pdf", title: "How to chat with a PDF" },
        { slug: "how-to-summarize-a-pdf-with-ai", title: "How to summarize a PDF with AI" },
      ]}
      faq={[
        { q: "Does it cite the source?", a: "Yes. Answers include page numbers so you can verify them in the original PDF." },
        { q: "Can I ask follow-up questions?", a: "Yes — keep asking. Each question is answered using the same uploaded document." },
        { q: "Is Chat with PDF free?", a: "AI features require a Pro or Business plan." },
      ]}
    />
  );
}
