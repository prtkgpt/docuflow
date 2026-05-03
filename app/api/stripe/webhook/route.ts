import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !whSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig as string, whSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 });
  }

  // checkout.session.completed handles two kinds of purchases:
  //   1. Subscription start (cs.mode === "subscription") → upsert the
  //      user's Subscription row.
  //   2. AI credit pack one-time payment (metadata.purchase === "credit_pack")
  //      → bump user.chatQuestionsCredits.
  if (event.type === "checkout.session.completed") {
    const cs = event.data.object as Stripe.Checkout.Session;
    const email = cs.customer_email;
    if (!email) return NextResponse.json({ received: true });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ received: true });

    if (cs.metadata?.purchase === "credit_pack") {
      const questions = parseInt(cs.metadata.questions ?? "0", 10);
      if (questions > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: { chatQuestionsCredits: { increment: questions } },
        });
      }
    } else {
      const plan = (cs.metadata?.plan as "plus" | "pro" | "business" | undefined) ?? "plus";
      await prisma.subscription.upsert({
        where: { userId: user.id },
        update: {
          plan,
          status: "active",
          stripeCustomerId: typeof cs.customer === "string" ? cs.customer : null,
          stripeSubscriptionId: typeof cs.subscription === "string" ? cs.subscription : null,
        },
        create: {
          userId: user.id,
          plan,
          status: "active",
          stripeCustomerId: typeof cs.customer === "string" ? cs.customer : null,
          stripeSubscriptionId: typeof cs.subscription === "string" ? cs.subscription : null,
        },
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: sub.id },
      data: { status: "canceled", plan: "free" },
    });
  }

  return NextResponse.json({ received: true });
}
