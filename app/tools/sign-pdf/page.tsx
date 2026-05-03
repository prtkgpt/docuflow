import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign PDF Online Free – Add Signature to PDF | MyPDFKitty",
  description:
    "Sign PDF files online for free with MyPDFKitty. Upload a PDF, draw or type your signature, place it on the document, and download your signed PDF.",
  path: "/tools/sign-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="sign-pdf"
      h1="Sign PDF Online Free"
      intro="Sign PDFs in your browser for free. Type or draw your signature, place it on the page, and download your signed PDF in seconds."
      uploadRedirect="/editor"
      metaTitle="Sign PDF Online Free – Add Signature to PDF | MyPDFKitty"
      metaDescription="Sign PDF files online for free with MyPDFKitty. Upload a PDF, draw or type your signature, place it on the document, and download your signed PDF."
      steps={[
        { name: "Upload the PDF", text: "Drop the contract, form, or document you need to sign." },
        { name: "Create your signature", text: "Type your name, draw with a mouse or trackpad, or upload a signature image." },
        { name: "Place & download", text: "Drag the signature onto the right page, resize, then click Done to download the signed PDF." },
      ]}
      whenToUse={[
        "Signing contracts, NDAs, or quotes from a laptop or phone.",
        "Returning signed forms to schools, landlords, or accountants.",
        "Adding initials to multiple pages of an agreement.",
        "Stamping a logo or signature on outgoing PDFs.",
      ]}
      relatedToolSlugs={["edit-pdf", "merge-pdf", "compress-pdf", "pdf-to-jpg"]}
      relatedBlogSlugs={[
        { slug: "how-to-sign-a-pdf-online", title: "How to sign a PDF online" },
        { slug: "how-to-edit-a-pdf-online", title: "How to edit a PDF online" },
      ]}
      faq={[
        { q: "Are signatures legally binding?", a: "Typed and drawn electronic signatures are accepted for most everyday agreements. For regulated workflows that require eIDAS or qualified e-signatures, use a service that specializes in legal signing." },
        { q: "Can I sign a PDF from my phone?", a: "Yes. The editor works in mobile browsers — drawing a signature with your finger is supported." },
        { q: "Can I add my signature on multiple pages?", a: "Yes. Place your signature on any page; copy it to additional pages by re-adding from the Sign tool." },
      ]}
    />
  );
}
