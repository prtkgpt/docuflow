import OpenAI from "openai";

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

// Centralized model picker. Default is gpt-4o-mini — the cheapest current
// mainstream OpenAI model ($0.15 / $0.60 per 1M tokens input/output).
// Override with the OPENAI_MODEL env var if a cheaper option ships later.
// Examples that don't need code changes:
//   gpt-4o-mini  — default; best quality/$ for summaries + chat
//   gpt-4.1-nano — cheaper alternative if/when available
// Cost rates are kept in sync in lib/ai/cost.ts.
export function getModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

// Cap the prompt size to avoid blowing past context. ~12k chars ≈ 3k tokens.
export function truncateForPrompt(text: string, max = 12000) {
  if (text.length <= max) return text;
  const head = text.slice(0, Math.floor(max * 0.7));
  const tail = text.slice(-Math.floor(max * 0.3));
  return `${head}\n\n[...truncated...]\n\n${tail}`;
}
