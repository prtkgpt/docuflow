import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NewEnvelopeWizard } from "@/components/envelopes/NewEnvelopeWizard";

export const dynamic = "force-dynamic";

export default async function NewEnvelopePage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?callbackUrl=/dashboard/envelopes/new");

  return (
    <div>
      <h1 className="text-2xl font-bold">New envelope</h1>
      <p className="mt-1 text-sm text-slate-600">
        Upload a PDF, add the people who need to sign, place signature fields, then send.
      </p>
      <div className="mt-6">
        <NewEnvelopeWizard />
      </div>
    </div>
  );
}
