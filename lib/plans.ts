export type PlanId = "free" | "plus" | "pro" | "business";
export type BillingInterval = "monthly" | "annual";

export type PlanAiLimits = {
  // Calls per UTC month, by feature.
  summariesPerMonth: number;
  chatPerMonth: number;
  // Cap how much extracted PDF text we'll send to the model in one call,
  // measured in tokens. Used to truncate the document or to bound the
  // retrieval context for chat.
  maxInputTokensPerDoc: number;
  // Cap the model's response length. Passed straight as max_tokens.
  maxOutputTokensPerAnswer: number;
};

export type Plan = {
  id: PlanId;
  name: string;
  subtitle: string;
  // USD. annual is the full yearly cost (not divided by 12).
  price: { monthly: number; annual: number };
  filesPeriod: "day" | "month";
  filesLimit: number;
  maxUploadMb: number;
  ai: PlanAiLimits;
  features: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  watermark?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    subtitle: "For quick one-off PDF tasks.",
    price: { monthly: 0, annual: 0 },
    filesPeriod: "day",
    filesLimit: 5,
    maxUploadMb: 25,
    ai: {
      summariesPerMonth: 1,
      chatPerMonth: 3,
      maxInputTokensPerDoc: 8_000,
      maxOutputTokensPerAnswer: 400,
    },
    features: [
      "5 files per day",
      "Max 25 MB per file",
      "Compress PDF",
      "Merge PDF",
      "Split PDF",
      "Rotate PDF",
      "Delete pages",
      "Sign PDF",
      "1 AI summary per month",
      "3 PDF chat questions per month",
    ],
    cta: "Start free",
    watermark: true,
  },
  {
    id: "plus",
    name: "Kitty Plus",
    subtitle: "For students, freelancers, and everyday PDF work.",
    price: { monthly: 2.99, annual: 24 },
    filesPeriod: "month",
    filesLimit: 200,
    maxUploadMb: 100,
    ai: {
      summariesPerMonth: 25,
      chatPerMonth: 100,
      maxInputTokensPerDoc: 75_000,
      maxOutputTokensPerAnswer: 600,
    },
    features: [
      "200 files per month",
      "Max 100 MB per file",
      "25 AI summaries per month",
      "100 PDF chat questions per month",
      "Up to 75,000 tokens per document",
      "No watermark",
      "Saved file history",
      "Email support",
    ],
    cta: "Upgrade to Plus",
    highlight: true,
    badge: "Most popular",
  },
  {
    id: "pro",
    name: "Kitty Pro",
    subtitle: "For power users who work with PDFs often.",
    price: { monthly: 5.99, annual: 49 },
    filesPeriod: "month",
    filesLimit: 1000,
    maxUploadMb: 250,
    ai: {
      summariesPerMonth: 100,
      chatPerMonth: 500,
      maxInputTokensPerDoc: 200_000,
      maxOutputTokensPerAnswer: 900,
    },
    features: [
      "1,000 files per month",
      "Max 250 MB per file",
      "100 AI summaries per month",
      "500 PDF chat questions per month",
      "Up to 200,000 tokens per document",
      "OCR PDF",
      "Batch processing",
      "Chat with multiple PDFs",
      "Priority processing",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "business",
    name: "Business",
    subtitle: "For small teams and businesses.",
    price: { monthly: 12.99, annual: 99 },
    filesPeriod: "month",
    filesLimit: 3000,
    maxUploadMb: 500,
    ai: {
      summariesPerMonth: 250,
      chatPerMonth: 1000,
      maxInputTokensPerDoc: 250_000,
      maxOutputTokensPerAnswer: 1200,
    },
    features: [
      "3 team seats included",
      "3,000 PDF actions per month",
      "250 AI summaries per month (shared)",
      "1,000 PDF chat questions per month (shared)",
      "Up to 250,000 tokens per document",
      "Shared workspace",
      "Admin controls",
      "Usage dashboard",
      "Additional seats: $3/month per seat",
    ],
    cta: "Start Business",
  },
];

// One-time purchase packs that top up a user's chat-question allowance.
// Stripe price IDs are looked up via getCreditPackPriceId().
export type CreditPack = {
  id: "small" | "medium" | "large";
  priceLabel: string;
  priceCents: number;       // raw dollar amount * 100, for sanity checks
  questions: number;
  perQuestionCents: number; // helper for "per question" copy
};

export const CREDIT_PACKS: CreditPack[] = [
  { id: "small",  priceLabel: "$5",  priceCents: 500,  questions: 500,  perQuestionCents: 1 },
  { id: "medium", priceLabel: "$10", priceCents: 1000, questions: 1500, perQuestionCents: 0.67 },
  { id: "large",  priceLabel: "$20", priceCents: 2000, questions: 4000, perQuestionCents: 0.5 },
];

export function getPlan(id: string | null | undefined): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function priceLabel(plan: Plan, interval: BillingInterval): string {
  const price = plan.price[interval];
  if (price === 0) return "$0";
  return `$${price.toString().replace(/\.00$/, "")}`;
}

export function annualSavings(plan: Plan): { dollars: number; percent: number } {
  const monthlyTotal = plan.price.monthly * 12;
  if (monthlyTotal === 0) return { dollars: 0, percent: 0 };
  const dollars = Math.max(0, Math.round((monthlyTotal - plan.price.annual) * 100) / 100);
  const percent = Math.round((dollars / monthlyTotal) * 100);
  return { dollars, percent };
}

// One env var per plan + interval, e.g. STRIPE_PLUS_MONTHLY_PRICE_ID or
// NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID. Returns undefined for free.
export function getStripePriceId(plan: PlanId, interval: BillingInterval): string | undefined {
  if (plan === "free") return undefined;
  const key = `STRIPE_${plan.toUpperCase()}_${interval.toUpperCase()}_PRICE_ID`;
  return process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
}

// Stripe price ID for a one-time AI credit pack purchase. Define via
// STRIPE_CREDIT_PACK_<ID>_PRICE_ID (e.g. STRIPE_CREDIT_PACK_SMALL_PRICE_ID).
export function getCreditPackPriceId(packId: CreditPack["id"]): string | undefined {
  const key = `STRIPE_CREDIT_PACK_${packId.toUpperCase()}_PRICE_ID`;
  return process.env[key] || process.env[`NEXT_PUBLIC_${key}`];
}
