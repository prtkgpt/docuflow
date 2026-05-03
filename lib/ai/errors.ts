// Map OpenAI SDK errors to clean user-facing messages and HTTP status codes.
// Without this we end up surfacing raw provider strings like "429: You
// exceeded your current quota" to end users, which looks broken even
// when the cause is on our side (we forgot to top up).
export type FriendlyAiError = {
  status: number;
  body: { error: string; code: string };
};

export function aiErrorResponse(e: unknown): FriendlyAiError {
  const err = e as { status?: number; code?: string; message?: string };
  const status = typeof err?.status === "number" ? err.status : 0;
  const message = (err?.message || "").toLowerCase();

  // OpenAI quota / billing — service-level outage from our perspective.
  // Don't burn the user's monthly counter or charge them; show a status
  // message instead.
  if (status === 429 || message.includes("quota") || err?.code === "insufficient_quota") {
    return {
      status: 503,
      body: {
        code: "AI_SERVICE_UNAVAILABLE",
        error:
          "AI is temporarily unavailable while we top up our provider account. Please try again in a few minutes — your usage today won't be charged for this attempt.",
      },
    };
  }

  // Auth issues with our OpenAI key.
  if (status === 401 || message.includes("invalid api key") || message.includes("incorrect api key")) {
    return {
      status: 503,
      body: {
        code: "AI_NOT_CONFIGURED",
        error: "AI is temporarily unavailable. Our team has been notified.",
      },
    };
  }

  // OpenAI rate limit (different from quota — they slow us down briefly).
  if (status === 503 || message.includes("rate limit")) {
    return {
      status: 503,
      body: {
        code: "AI_BUSY",
        error: "AI is busy right now. Try again in a few seconds.",
      },
    };
  }

  // Generic upstream failure.
  return {
    status: 502,
    body: {
      code: "AI_UPSTREAM_ERROR",
      error: "AI provider returned an error. Please try again.",
    },
  };
}
