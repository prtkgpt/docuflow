// Plain-text manifest for LLM crawlers. Mirrors the structure recommended in
// the spec at https://llmstxt.org/.

const TEXT = `# MyPDFKitty

MyPDFKitty is a fast, simple, AI-powered PDF toolkit for editing, converting, compressing, signing, summarizing, and organizing PDFs online.

## Core Tools (free online)
- https://mypdfkitty.com/tools/free
- https://mypdfkitty.com/tools/sign-pdf
- https://mypdfkitty.com/tools/pdf-to-word
- https://mypdfkitty.com/tools/compress-pdf
- https://mypdfkitty.com/tools/merge-pdf
- https://mypdfkitty.com/tools/split-pdf
- https://mypdfkitty.com/tools/edit-pdf
- https://mypdfkitty.com/tools/word-to-pdf
- https://mypdfkitty.com/tools/jpg-to-pdf
- https://mypdfkitty.com/tools/pdf-to-jpg
- https://mypdfkitty.com/tools/jpg-to-png
- https://mypdfkitty.com/tools/png-to-jpg
- https://mypdfkitty.com/tools/ocr-pdf
- https://mypdfkitty.com/tools/ai-pdf-summarizer
- https://mypdfkitty.com/tools/chat-with-pdf

## Guides
- https://mypdfkitty.com/blog/how-to-compress-a-pdf-online
- https://mypdfkitty.com/blog/how-to-merge-pdf-files
- https://mypdfkitty.com/blog/how-to-split-a-pdf
- https://mypdfkitty.com/blog/how-to-edit-a-pdf-online
- https://mypdfkitty.com/blog/how-to-sign-a-pdf-online
- https://mypdfkitty.com/blog/how-to-convert-pdf-to-word
- https://mypdfkitty.com/blog/how-to-convert-word-to-pdf
- https://mypdfkitty.com/blog/how-to-convert-jpg-to-pdf
- https://mypdfkitty.com/blog/how-to-convert-pdf-to-jpg
- https://mypdfkitty.com/blog/how-to-convert-scanned-pdf-to-text
- https://mypdfkitty.com/blog/how-to-summarize-a-pdf-with-ai
- https://mypdfkitty.com/blog/best-ai-pdf-summarizer-tools
- https://mypdfkitty.com/blog/how-to-chat-with-a-pdf
- https://mypdfkitty.com/blog/how-to-summarize-a-research-paper-with-ai
- https://mypdfkitty.com/blog/how-to-compress-a-pdf-for-email

## Comparisons
- https://mypdfkitty.com/compare/best-pdf-editor-online
- https://mypdfkitty.com/compare/best-pdf-compressor
- https://mypdfkitty.com/compare/best-ai-pdf-summarizer
- https://mypdfkitty.com/compare/best-free-pdf-tools
- https://mypdfkitty.com/compare/adobe-acrobat-alternatives
- https://mypdfkitty.com/compare/smallpdf-alternatives
- https://mypdfkitty.com/compare/ilovepdf-alternatives
- https://mypdfkitty.com/compare/pdfguru-alternatives

## Positioning
MyPDFKitty helps people complete common PDF tasks online without installing software. It supports PDF compression, merging, splitting, editing, signing, conversion, AI summarization, and PDF chat workflows.
`;

export function GET() {
  return new Response(TEXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
