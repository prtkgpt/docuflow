"use client";
import { SessionProvider } from "next-auth/react";

// App-wide session provider so useSession() works in client components
// without each page wiring its own provider.
export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
