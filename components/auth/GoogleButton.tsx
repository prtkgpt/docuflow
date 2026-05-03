"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

// SVG mark used by Google's official sign-in branding.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.6 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C33.7 6 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C33.7 6 29.1 4 24 4 16.4 4 9.8 8.4 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5.1l-6-5C28.9 35.6 26.6 36.5 24 36.5c-5.2 0-9.6-3.4-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-2.9 4.9-5.4 6.4l6 5C39 38.4 44 32 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export function GoogleButton({ callbackUrl = "/dashboard", label = "Continue with Google" }: { callbackUrl?: string; label?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl })}
    >
      <GoogleIcon /> {label}
    </Button>
  );
}
