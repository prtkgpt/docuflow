import { getOpenAI, getModel } from "@/lib/ai/openai";
import { findLanguage, ENGLISH, type Language } from "@/lib/i18n/languages";

// Chunked translation with OpenAI. We split long documents into bite-sized
// chunks because some target languages are 30-50% longer than the source —
// translating the whole document in one shot blows past the model's
// max_tokens cap on output.
const CHUNK_CHARS = 4000;

export type TranslationChunk = { source: string; translated: string };
export type TranslationResult = {
  chunks: TranslationChunk[];
  fromCode: string;
  toCode: string;
  fromName: string;
  toName: string;
  inputTokens: number;
  outputTokens: number;
};

export async function translateText(opts: {
  text: string;
  from?: string;          // ISO 639-1 or "auto"
  to: string;             // ISO 639-1
}): Promise<TranslationResult> {
  const openai = getOpenAI();
  if (!openai) throw new Error("OpenAI API key not configured");

  const target: Language = findLanguage(opts.to) ?? ENGLISH;
  const source: Language | undefined = opts.from && opts.from !== "auto"
    ? findLanguage(opts.from)
    : undefined;

  const chunks = chunk(opts.text, CHUNK_CHARS);
  if (chunks.length === 0) {
    throw new Error("No text to translate");
  }

  const out: TranslationChunk[] = [];
  let inputTokens = 0;
  let outputTokens = 0;
  const model = getModel();

  for (const piece of chunks) {
    const sourceLine = source
      ? `Translate the following text from ${source.name} to ${target.name}.`
      : `Detect the source language and translate the following text to ${target.name}.`;
    const completion = await openai.chat.completions.create({
      model,
      // No fixed max_tokens — translations can be longer than source. Rely
      // on the per-chunk cap above to keep responses bounded.
      messages: [
        {
          role: "system",
          content:
            `You are a professional translator. ${sourceLine} ` +
            `Preserve paragraph breaks, lists, and numbers. Output only the translated text — no preamble, no explanation, no quotes.`,
        },
        { role: "user", content: piece },
      ],
      temperature: 0.1,
    });
    const translated = completion.choices[0]?.message?.content?.trim() || "";
    out.push({ source: piece, translated });
    inputTokens += completion.usage?.prompt_tokens ?? 0;
    outputTokens += completion.usage?.completion_tokens ?? 0;
  }

  return {
    chunks: out,
    fromCode: source?.code ?? "auto",
    toCode: target.code,
    fromName: source?.name ?? "Auto-detected",
    toName: target.name,
    inputTokens,
    outputTokens,
  };
}

function chunk(text: string, target: number): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];
  if (trimmed.length <= target) return [trimmed];

  // Split on paragraph boundaries; pack into target-sized buckets.
  const paragraphs = trimmed.split(/\n{2,}/);
  const out: string[] = [];
  let buffer = "";
  for (const p of paragraphs) {
    if (buffer.length + p.length + 2 > target && buffer) {
      out.push(buffer.trim());
      buffer = p;
    } else {
      buffer = buffer ? `${buffer}\n\n${p}` : p;
    }
  }
  if (buffer.trim()) out.push(buffer.trim());
  return out;
}
