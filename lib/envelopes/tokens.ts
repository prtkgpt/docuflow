import { randomBytes } from "crypto";

// 32 random bytes → 43-char URL-safe base64. Long enough that brute-forcing
// signing links is infeasible.
export function newSigningToken(): string {
  return randomBytes(32).toString("base64url");
}
