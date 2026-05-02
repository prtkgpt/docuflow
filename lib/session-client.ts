// Small client-side helpers around NextAuth's REST endpoints so we don't have
// to add SessionProvider / next-auth/react to every page.

export type ClientSession = {
  user?: { id?: string; email?: string | null; name?: string | null };
  expires?: string;
} | null;

export async function getClientSession(): Promise<ClientSession> {
  try {
    const res = await fetch("/api/auth/session", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.user) return null;
    return data as ClientSession;
  } catch {
    return null;
  }
}

export async function getCsrfToken(): Promise<string> {
  try {
    const r = await fetch("/api/auth/csrf");
    const d = await r.json();
    return d.csrfToken || "";
  } catch {
    return "";
  }
}

export async function signInWithEmail(email: string, name?: string): Promise<boolean> {
  const csrf = await getCsrfToken();
  const res = await fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      email,
      name: name || "",
      csrfToken: csrf,
      redirect: "false",
      json: "true",
    }).toString(),
    credentials: "include",
  });
  return res.ok;
}
