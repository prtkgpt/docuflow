export type PlanId = "free" | "plus" | "pro" | "business";
export type BillingInterval = "monthly" | "annual";

export type Plan = {
  id: PlanId;
  name: string;
  subtitle: string;
  // Prices in USD. `annual` is the full yearly cost, not divided by 12.
  price: { monthly: number; annual: number };
  // Files quota uses one period per plan: free = day, paid = month.
  filesPeriod: "day" | "month";
  filesLimit: number;
  maxUploadMb: number;
  features: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
  // True when the plan adds a watermark to AI summaries / outputs.
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
    features: [
      "5 files per day",
      "Max 25 MB per file",
      "Compress PDF",
      "Merge PDF",
      "Split PDF",
      "Rotate PDF",
      "Delete pages",
      "Sign PDF",
      "3 AI summaries per month",
      "Watermark only on AI summaries",
    ],
    cta: "Start free",
    watermark: true,
  },
  {
    id: "plus",
    name: "Kitty Plus",
    subtitle: "For students, freelancers, and everyday PDF work.",
    price: { monthly: 2.99, annual: 19 },
    filesPeriod: "month",
    filesLimit: 200,
    maxUploadMb: 100,
    features: [
      "200 files per month",
      "Max 100 MB per file",
      "No watermark",
      "AI PDF summaries",
      "Chat with PDF",
      "Saved file history",
      "Faster processing",
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
    price: { monthly: 5.99, annual: 39 },
    filesPeriod: "month",
    filesLimit: 1000,
    maxUploadMb: 250,
    features: [
      "1,000 files per month",
      "Max 250 MB per file",
      "Batch processing",
      "Advanced AI summaries",
      "Chat with multiple PDFs",
      "OCR PDF",
      "Priority processing",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
  },
  {
    id: "business",
    name: "Business",
    subtitle: "For small teams and businesses.",
    price: { monthly: 9.99, annual: 79 },
    filesPeriod: "month",
    filesLimit: 3000,
    maxUploadMb: 500,
    features: [
      "3 team seats included",
      "3,000 files per month",
      "Max 500 MB per file",
      "Team workspace",
      "Shared file history",
      "Shared templates",
      "Admin controls",
      "Commercial use",
      "Additional seats: $3/month per seat",
    ],
    cta: "Start Business",
  },
];

export function getPlan(id: string | null | undefined): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}

export function priceLabel(plan: Plan, interval: BillingInterval): string {
  const price = plan.price[interval];
  if (price === 0) return "$0";
  // Drop trailing .00 for cleaner display.
  return `$${price.toString().replace(/\.00$/, "")}`;
}

// Savings between paying 12× monthly and the annual rate.
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
