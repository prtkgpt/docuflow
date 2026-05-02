import OpenAI from "openai";

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

// Cap the prompt size to avoid blowing past context. ~12k chars ≈ 3k tokens.
export function truncateForPrompt(text: string, max = 12000) {
  if (text.length <= max) return text;
  const head = text.slice(0, Math.floor(max * 0.7));
  const tail = text.slice(-Math.floor(max * 0.3));
  return `${head}\n\n[...truncated...]\n\n${tail}`;
}
