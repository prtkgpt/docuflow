import { getOpenAI } from "@/lib/ai/openai";

// OpenAI's smallest, cheapest embedding model. $0.020 per 1M tokens —
// at our chunk sizes that's roughly $0.0001 per PDF chunked once.
export const EMBED_MODEL = "text-embedding-3-small";
export const EMBED_DIM = 1536;

export type Embedded = { vector: number[]; tokens: number };

// Embed a single text. Returns null if OpenAI is unavailable so callers
// can fall back to keyword retrieval.
export async function embedText(text: string): Promise<Embedded | null> {
  const openai = getOpenAI();
  if (!openai) return null;
  try {
    const res = await openai.embeddings.create({
      model: EMBED_MODEL,
      input: text.slice(0, 30_000), // hard ceiling per call
    });
    return {
      vector: res.data[0]?.embedding ?? [],
      tokens: res.usage?.total_tokens ?? 0,
    };
  } catch (e) {
    console.error("[embeddings] embedText failed:", e);
    return null;
  }
}

// Batch embed — up to ~100 texts per OpenAI call. Caller passes the
// texts in any order; we return embeddings in matching order.
export async function embedBatch(texts: string[]): Promise<{ vectors: number[][]; tokens: number } | null> {
  const openai = getOpenAI();
  if (!openai) return null;
  if (texts.length === 0) return { vectors: [], tokens: 0 };
  try {
    // OpenAI accepts string[] for `input`. We trim to keep costs predictable.
    const inputs = texts.map((t) => t.slice(0, 30_000));
    const res = await openai.embeddings.create({
      model: EMBED_MODEL,
      input: inputs,
    });
    const vectors = res.data.map((d) => d.embedding);
    return { vectors, tokens: res.usage?.total_tokens ?? 0 };
  } catch (e) {
    console.error("[embeddings] embedBatch failed:", e);
    return null;
  }
}

// Cosine similarity. Both vectors are assumed to be the same length and
// already normalized (OpenAI's embedding API returns unit-length vectors,
// so we can skip the sqrt).
export function cosineSimilarity(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < n; i++) dot += a[i] * b[i];
  return dot;
}

// Top-K retrieval over a list of embedded chunks for a question vector.
export function rankByCosine<T extends { vector: number[] }>(
  chunks: T[],
  query: number[],
  k: number,
): { item: T; score: number }[] {
  return chunks
    .map((item) => ({ item, score: cosineSimilarity(item.vector, query) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
