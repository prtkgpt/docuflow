import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getStripePriceId } from "@/lib/plans";

export const runtime = "nodejs";

const Body = z.object({
  plan: z.enum(["plus", "pro", "business"]),
  interval: z.enum(["monthly", "annual"]).default("monthly"),
});

export async function POST(req: NextRequest) {
  try {
    const { plan, interval } = Body.parse(await req.json());

    const session = await getServerSession(authOptions).catch(() => null);
    const email = session?.user?.email;

    const secret = process.env.STRIPE_SECRET_KEY;
    const priceId = getStripePriceId(plan, interval);

    // Mock checkout for environments without Stripe configured. The UI shows
    // a friendly redirect to /pricing?checkout=mock so the flow stays
    // testable without API keys.
    if (!secret || !priceId) {
      const url = new URL("/pricing", req.nextUrl.origin);
      url.searchParams.set("checkout", "mock");
      url.searchParams.set("plan", plan);
      url.searchParams.set("interval", interval);
      return NextResponse.json({ url: url.toString(), mock: true });
    }

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email ?? undefined,
      success_url: `${req.nextUrl.origin}/dashboard/billing?status=success`,
      cancel_url: `${req.nextUrl.origin}/pricing?status=cancelled`,
      metadata: { plan, interval },
      allow_promotion_codes: true,
    });
    return NextResponse.json({ url: checkout.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Checkout failed" }, { status: 400 });
  }
}
