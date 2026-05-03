import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const sub = await prisma.subscription.findUnique({ where: { userId } });
  if (!sub?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No active subscription. Upgrade first.", code: "NO_SUBSCRIPTION" },
      { status: 400 },
    );
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${req.nextUrl.origin}/dashboard/billing`,
  });
  return NextResponse.json({ url: portal.url });
}
