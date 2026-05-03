// Lightweight keyword retrieval over a PDF's stored chunks. We avoid
// embeddings on purpose for v1 to keep cost and complexity down — the
// keyword scorer below catches the typical "find the X clause" /
// "what's the Y number" questions we see most often. We can swap in
// OpenAI embeddings + cosine similarity later without changing callers.

const STOPWORDS = new Set([
  "a","an","and","are","as","at","be","but","by","for","from","has","have",
  "in","is","it","its","of","on","or","that","the","this","to","was","were",
  "will","with","you","your","what","which","when","where","why","how","do",
  "does","did","i","me","my","we","our","they","them","their","he","she",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9_\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

// Score a chunk by counting query-term frequency, length-normalized so
// long chunks aren't unfairly favored. Inspired by BM25 but trimmed.
export function scoreChunk(chunkText: string, query: string): number {
  const qTerms = tokenize(query);
  if (qTerms.length === 0) return 0;
  const cTerms = tokenize(chunkText);
  if (cTerms.length === 0) return 0;
  const cFreq = new Map<string, number>();
  for (const t of cTerms) cFreq.set(t, (cFreq.get(t) ?? 0) + 1);
  let score = 0;
  for (const q of qTerms) {
    const f = cFreq.get(q) ?? 0;
    if (f > 0) score += (f * (q.length >= 5 ? 1.4 : 1.0)) / Math.sqrt(cTerms.length);
  }
  return score;
}

export type ScoredChunk = { index: number; text: string; score: number };

// Pick the top K chunks for a question. If no chunk scores above zero
// (purely conversational or vague question), fall back to the first K
// chunks so the model still has document context to work with.
export function retrieveTopK(
  chunks: { index: number; text: string }[],
  query: string,
  k = 5,
): ScoredChunk[] {
  const scored: ScoredChunk[] = chunks.map((c) => ({
    index: c.index,
    text: c.text,
    score: scoreChunk(c.text, query),
  }));
  const top = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
  if (top.length > 0) return top;
  return chunks.slice(0, k).map((c) => ({ ...c, score: 0 }));
}
