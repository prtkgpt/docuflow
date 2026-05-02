import { ToolPage } from "@/components/ToolPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sign PDF Online – Add Your Signature | MyPDFKitty",
  description:
    "Sign PDF documents online by typing, drawing, or uploading your signature. Use MyPDFKitty to sign forms, contracts, and documents quickly.",
  path: "/tools/sign-pdf",
});

export default function Page() {
  return (
    <ToolPage
      slug="sign-pdf"
      h1="Sign PDF Online"
      intro="Sign PDFs in your browser by typing, drawing, or uploading your signature. Place your signature anywhere on the page and download a signed PDF."
      uploadRedirect="/editor"
      metaTitle="Sign PDF Online – Add Your Signature | MyPDFKitty"
      metaDescription="Sign PDF documents online by typing, drawing, or uploading your signature. Use MyPDFKitty to sign forms, contracts, and documents quickly."
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
