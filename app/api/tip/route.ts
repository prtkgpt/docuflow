import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";

// Allow $1 minimum and $500 maximum to keep this honest. Any custom
// amount in between works; presets are just suggestions on the UI.
const Body = z.object({
  amountCents: z.number().int().min(100).max(50_000),
  message: z.string().trim().max(280).optional(),
});

// One-time tip payment via Stripe Checkout. Uses ad-hoc price_data so we
// don't need a separate Stripe Price for every preset amount.
export async function POST(req: NextRequest) {
  try {
    const { amountCents, message } = Body.parse(await req.json());

    const session = await getServerSession(authOptions).catch(() => null);
    const email = session?.user?.email ?? undefined;

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      // Dev / preview without Stripe — bounce to a "thanks anyway" page.
      const url = new URL("/tip/thanks", req.nextUrl.origin);
      url.searchParams.set("mock", "1");
      url.searchParams.set("amount", String(amountCents));
      return NextResponse.json({ url: url.toString(), mock: true });
    }

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: `Tip the kitty 🐱 — ${SITE.name}`,
              description: message?.slice(0, 200) || "Thanks for keeping the lights on at MyPDFKitty.",
            },
          },
        },
      ],
      customer_email: email,
      success_url: `${req.nextUrl.origin}/tip/thanks?amount=${amountCents}`,
      cancel_url: `${req.nextUrl.origin}/tip?cancelled=1`,
      // Webhook keys off this to avoid treating tips as subscription upgrades.
      metadata: {
        purchase: "tip",
        amountCents: String(amountCents),
        message: message?.slice(0, 200) ?? "",
      },
    });
    return NextResponse.json({ url: checkout.url });
  } catch (e: any) {
    const msg = e?.errors?.[0]?.message ?? e?.message ?? "Could not start tip checkout";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
