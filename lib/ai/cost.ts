// OpenAI input/output token rates for the models we use. Returns USD.
// Source: https://openai.com/api/pricing — keep this short list aligned
// with what we actually call from server routes.
const RATES_PER_1M_TOKENS: Record<string, { input: number; output: number }> = {
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "gpt-4o":      { input: 2.50, output: 10.00 },
  "gpt-4.1-mini":{ input: 0.40, output: 1.60 },
};

export function estimateCostUsd(
  model: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const r = RATES_PER_1M_TOKENS[model] ?? RATES_PER_1M_TOKENS["gpt-4o-mini"];
  const cost = (inputTokens / 1_000_000) * r.input + (outputTokens / 1_000_000) * r.output;
  // Round to 6 decimals to match the Decimal(12,6) column.
  return Math.round(cost * 1_000_000) / 1_000_000;
}

// Convert USD cost to integer cents for the rolling PlanUsage column.
export function usdToCents(usd: number): number {
  return Math.round(usd * 100);
}

// Rough character→token estimator. OpenAI tokens average ~4 chars but
// vary widely; this is good enough for budget caps where we slightly
// over-estimate to be safe.
export function approxTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function approxCharsForTokens(tokens: number): number {
  return tokens * 4;
}

// Truncate text to roughly N tokens, used to enforce per-plan input caps.
export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = approxCharsForTokens(maxTokens);
  if (text.length <= maxChars) return text;
  // Keep the first ~70% from the start and the last ~30% so important
  // tail content (conclusions, action items) survives.
  const head = text.slice(0, Math.floor(maxChars * 0.7));
  const tail = text.slice(-Math.floor(maxChars * 0.3));
  return `${head}\n\n[...truncated for plan input cap...]\n\n${tail}`;
}
