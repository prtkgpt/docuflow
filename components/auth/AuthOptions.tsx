"use client";
import { useEffect, useState } from "react";
import { GoogleButton } from "./GoogleButton";

// Renders the "Continue with Google" button + a divider, but only when
// Google OAuth is configured on this environment. Falls back to nothing
// so the email-only credentials flow still works seamlessly.
export function AuthOptions({ callbackUrl, label }: { callbackUrl?: string; label?: string }) {
  const [hasGoogle, setHasGoogle] = useState(false);
  useEffect(() => {
    fetch("/api/auth/providers-info")
      .then((r) => r.json())
      .then((d) => setHasGoogle(!!d.google))
      .catch(() => setHasGoogle(false));
  }, []);
  if (!hasGoogle) return null;
  return (
    <div className="space-y-3">
      <GoogleButton callbackUrl={callbackUrl} label={label} />
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs uppercase tracking-wide text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
    </div>
  );
}
