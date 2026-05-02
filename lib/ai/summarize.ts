import { getOpenAI, truncateForPrompt } from "./openai";

export type Summary = {
  short: string;
  bullets: string[];
  takeaways: string[];
  actions: string[];
};

const SYSTEM = `You are an assistant that summarizes documents.
Return JSON with keys: short, bullets, takeaways, actions.
- short: 2-3 sentence executive summary
- bullets: 3-7 bullet points covering core content
- takeaways: 3-5 key insights
- actions: 0-5 concrete next-step action items (empty array if none)
Respond with JSON only.`;

export async function summarizeText(text: string): Promise<Summary> {
  const openai = getOpenAI();
  const trimmed = truncateForPrompt(text);

  if (!openai) {
    // Graceful fallback so the UI works without an API key during dev.
    const lines = trimmed.split(/\n+/).filter((l) => l.trim().length > 0).slice(0, 6);
    return {
      short: "OpenAI API key not configured. Showing a placeholder summary based on the first lines of the document.",
      bullets: lines.slice(0, 5).map((l) => l.slice(0, 160)),
      takeaways: ["Configure OPENAI_API_KEY to enable real AI summaries."],
      actions: ["Add OPENAI_API_KEY in Vercel project settings."],
    };
  }

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: trimmed },
    ],
    temperature: 0.2,
  });

  const raw = resp.choices[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw);
  return {
    short: parsed.short ?? "",
    bullets: Array.isArray(parsed.bullets) ? parsed.bullets : [],
    takeaways: Array.isArray(parsed.takeaways) ? parsed.takeaways : [],
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
  };
}

export async function chatWithDocument(
  pageTexts: string[],
  question: string,
): Promise<{ answer: string; pages: number[] }> {
  const openai = getOpenAI();
  const context = pageTexts
    .map((t, i) => `--- Page ${i + 1} ---\n${t.slice(0, 2000)}`)
    .join("\n\n");
  const trimmed = truncateForPrompt(context, 14000);

  if (!openai) {
    return {
      answer: "OpenAI API key not configured. Add OPENAI_API_KEY in Vercel to enable Chat with PDF.",
      pages: [],
    };
  }

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Answer questions about the user's PDF using only the provided pages. " +
          "Cite the page numbers you used in square brackets, e.g. [Page 2]. " +
          "If the answer isn't in the document, say so.",
      },
      { role: "user", content: `Document:\n\n${trimmed}\n\nQuestion: ${question}` },
    ],
    temperature: 0.1,
  });
  const answer = resp.choices[0]?.message?.content || "";
  const pages = Array.from(new Set(Array.from(answer.matchAll(/Page\s+(\d+)/gi)).map((m) => parseInt(m[1], 10))));
  return { answer, pages };
}
