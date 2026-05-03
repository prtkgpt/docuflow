import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CREDIT_PACKS, getCreditPackPriceId } from "@/lib/plans";

export const runtime = "nodejs";

const Body = z.object({ pack: z.enum(["small", "medium", "large"]) });

// One-time-payment Stripe Checkout for an AI credit pack. Webhook listens
// for checkout.session.completed and increments user.chatQuestionsCredits.
export async function POST(req: NextRequest) {
  try {
    const { pack } = Body.parse(await req.json());
    const packDef = CREDIT_PACKS.find((p) => p.id === pack);
    if (!packDef) return NextResponse.json({ error: "Unknown pack" }, { status: 400 });

    const session = await getServerSession(authOptions).catch(() => null);
    const email = session?.user?.email;
    if (!email) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

    const secret = process.env.STRIPE_SECRET_KEY;
    const priceId = getCreditPackPriceId(pack);

    if (!secret || !priceId) {
      // Mock — redirect back to pricing with a flag so the UI can show a
      // "would have purchased" toast in dev/preview deploys.
      const url = new URL("/pricing", req.nextUrl.origin);
      url.searchParams.set("checkout", "mock-credits");
      url.searchParams.set("pack", pack);
      return NextResponse.json({ url: url.toString(), mock: true });
    }

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: `${req.nextUrl.origin}/dashboard/billing?status=credits-added&pack=${pack}`,
      cancel_url: `${req.nextUrl.origin}/pricing?status=cancelled`,
      metadata: {
        purchase: "credit_pack",
        pack,
        questions: String(packDef.questions),
      },
    });
    return NextResponse.json({ url: checkout.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Checkout failed" }, { status: 400 });
  }
}
