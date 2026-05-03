import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/admin";
import { magicLinkHtml } from "@/lib/email";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Health check for the magic-link / email pipeline.
//
//   GET  /api/debug/email          — public; safe boolean checks only.
//                                    No secret values are exposed; just
//                                    "is X set" + Resend reachability.
//   POST /api/debug/email { to }   — admin-only; sends a real test email.
export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const allowPasswordless = process.env.ALLOW_PASSWORDLESS_SIGNIN === "true";

  // Boolean checks: never echo back the actual secret values, just
  // whether they're present and shaped right.
  const checks: { name: string; ok: boolean; detail: string }[] = [
    {
      name: "RESEND_API_KEY",
      ok: !!apiKey && apiKey.startsWith("re_"),
      detail: apiKey
        ? `set (length ${apiKey.length}, starts with "${apiKey.slice(0, 3)}…")`
        : "MISSING — magic-link Email provider will not be registered",
    },
    {
      name: "EMAIL_FROM",
      ok: !!from && /<[^>]+@[^>]+>$/.test(from),
      detail: from
        ? from
        : "MISSING — defaulting to MyPDFKitty <onboarding@resend.dev>",
    },
    {
      name: "EMAIL_REPLY_TO",
      ok: true,
      detail: replyTo || `(default: ${SITE.email})`,
    },
    {
      name: "NEXTAUTH_URL",
      ok: nextAuthUrl === SITE.url || nextAuthUrl === `${SITE.url}/`,
      detail: nextAuthUrl
        ? `${nextAuthUrl}${nextAuthUrl !== SITE.url && nextAuthUrl !== `${SITE.url}/` ? ` ⚠ does not match expected ${SITE.url}` : ""}`
        : `MISSING — magic-link URLs will be malformed`,
    },
    {
      name: "ALLOW_PASSWORDLESS_SIGNIN",
      ok: !allowPasswordless,
      detail: allowPasswordless
        ? "true (legacy fallback ENABLED — credentials provider will run)"
        : "(off, magic-link first)",
    },
  ];

  // Inferred provider list — what /lib/auth.ts will actually register
  // given the env vars above. This is the single most useful diagnostic
  // because it tells us whether EmailProvider is loaded at all.
  const providers: string[] = [];
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) providers.push("google");
  if (apiKey) providers.push("email (magic link via Resend)");
  if (allowPasswordless || !apiKey) providers.push("credentials (passwordless)");

  // Hit Resend's domain-list endpoint to confirm the API key works AND
  // tell us whether mypdfkitty.com is verified.
  let resendStatus: any = { reachable: false };
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const domains = await resend.domains.list();
      const list: any = (domains.data as any)?.data ?? domains.data ?? [];
      resendStatus = {
        reachable: true,
        domains: Array.isArray(list)
          ? list.map((d: any) => ({ name: d.name, status: d.status, region: d.region }))
          : [],
      };
    } catch (e: any) {
      resendStatus = { reachable: false, error: e?.message || String(e) };
    }
  }

  return NextResponse.json({
    ok: checks.every((c) => c.ok),
    deployedCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
    providers,
    checks,
    resend: resendStatus,
    next: providers.includes("email (magic link via Resend)")
      ? "Magic-link provider is loaded. If no Resend activity, run a POST { to: 'you@example.com' } against this endpoint (admin only) to send a test."
      : "Magic-link provider is NOT loaded. Set RESEND_API_KEY in Vercel Production env vars and redeploy.",
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: 401 });

  const { to } = await req.json().catch(() => ({}));
  if (!to || typeof to !== "string") {
    return NextResponse.json({ error: "Provide { to: string }" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const fromAddr = process.env.EMAIL_FROM || "MyPDFKitty <onboarding@resend.dev>";
  const fakeUrl = `${process.env.NEXTAUTH_URL || SITE.url}/api/auth/callback/email?token=DEBUG_TEST&email=${encodeURIComponent(to)}`;

  try {
    const res = await resend.emails.send({
      from: fromAddr,
      to,
      subject: "[debug] MyPDFKitty magic-link test",
      html: magicLinkHtml(fakeUrl),
      replyTo: process.env.EMAIL_REPLY_TO || SITE.email,
    });
    if (res.error) {
      return NextResponse.json(
        {
          ok: false,
          error: res.error.message || res.error,
          name: (res.error as any).name,
          fromAddr,
          to,
        },
        { status: 502 },
      );
    }
    return NextResponse.json({
      ok: true,
      id: res.data?.id,
      fromAddr,
      to,
      hint: "Email sent via Resend. Check inbox; if it doesn't arrive, look in spam or check Resend → Logs.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e), fromAddr, to },
      { status: 502 },
    );
  }
}
