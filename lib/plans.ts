export type PlanId = "free" | "pro" | "business";

export type Plan = {
  id: PlanId;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  monthlyFiles: number;
  maxUploadMb: number;
  features: string[];
  cta: string;
  highlight?: boolean;
  stripePriceEnv?: string;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    priceLabel: "$0",
    description: "Get started with core PDF tools.",
    monthlyFiles: 3,
    maxUploadMb: 10,
    features: ["3 files / month", "Max 10 MB per file", "Basic editing tools", "Watermark on AI summaries"],
    cta: "Start free",
  },
  {
    id: "pro",
    name: "Pro",
    price: 9,
    priceLabel: "$9",
    description: "For everyday document workflows.",
    monthlyFiles: 100,
    maxUploadMb: 100,
    features: ["100 files / month", "Up to 100 MB", "All editing tools", "AI summaries", "Priority processing"],
    cta: "Upgrade to Pro",
    highlight: true,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
  },
  {
    id: "business",
    name: "Business",
    price: 29,
    priceLabel: "$29",
    description: "For teams and heavy users.",
    monthlyFiles: 1000,
    maxUploadMb: 500,
    features: ["1,000 files / month", "Up to 500 MB", "Team workspace", "Advanced AI tools", "API access (coming soon)"],
    cta: "Upgrade to Business",
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID",
  },
];

export function getPlan(id: string | null | undefined): Plan {
  return PLANS.find((p) => p.id === id) ?? PLANS[0];
}
