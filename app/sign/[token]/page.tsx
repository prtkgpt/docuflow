import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SigningClient } from "@/components/envelopes/SigningClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign document — MyPDFKitty",
  description: "Review and sign the document shared with you.",
  robots: { index: false, follow: false },
};

export default function SignPage({ params }: { params: { token: string } }) {
  return (
    <>
      <Header />
      <main className="container py-6 md:py-10 max-w-6xl">
        <SigningClient token={params.token} />
      </main>
      <Footer />
    </>
  );
}
