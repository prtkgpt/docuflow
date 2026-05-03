import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAdmin } from "@/lib/admin";
import { magicLinkHtml } from "@/lib/email";
import { SITE } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only health check for the magic-link / email pipeline. Tells you
// at a glance which env var is wrong without having to dig through
// Vercel logs.
//
//   GET  /api/debug/email                — config probe + Resend domain status
//   POST /api/debug/email { to: "..." }  — sends a test magic-link email
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: 401 });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const replyTo = process.env.EMAIL_REPLY_TO;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const allowPasswordless = process.env.ALLOW_PASSWORDLESS_SIGNIN === "true";

  const checks: { name: string; ok: boolean; detail: string }[] = [];

  checks.push({
    name: "RESEND_API_KEY",
    ok: !!apiKey,
    detail: apiKey ? `set (length ${apiKey.length})` : "missing — magic link will fall back to credentials",
  });
  checks.push({
    name: "EMAIL_FROM",
    ok: !!from,
    detail: from || "missing — defaulting to MyPDFKitty <onboarding@resend.dev>",
  });
  checks.push({
    name: "EMAIL_REPLY_TO",
    ok: true,
    detail: replyTo || `(default: ${SITE.email})`,
  });
  checks.push({
    name: "NEXTAUTH_URL",
    ok: nextAuthUrl === SITE.url || nextAuthUrl === `${SITE.url}/`,
    detail: nextAuthUrl
      ? nextAuthUrl + (nextAuthUrl !== SITE.url && nextAuthUrl !== `${SITE.url}/` ? ` ⚠ does not match SITE.url ${SITE.url}` : "")
      : `missing — magic links will use the wrong base URL`,
  });
  checks.push({
    name: "ALLOW_PASSWORDLESS_SIGNIN",
    ok: !allowPasswordless,
    detail: allowPasswordless ? "true (legacy fallback ENABLED — magic link may be skipped)" : "(off, magic-link first)",
  });

  // Hit Resend's domain-list endpoint to confirm the API key works AND
  // tell us whether mypdfkitty.com is verified.
  let resendStatus: any = { reachable: false };
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const domains = await resend.domains.list();
      const list = (domains.data as any)?.data ?? domains.data ?? [];
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
    checks,
    resend: resendStatus,
    note:
      "If RESEND_API_KEY is set but no email arrives, POST { to: 'you@example.com' } to this endpoint to send a test message and see the exact Resend error.",
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
      hint: "Email sent via Resend. Check the inbox; if it doesn't arrive in 1-2 minutes, look in spam or check Resend → Logs in the dashboard.",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e), fromAddr, to },
      { status: 502 },
    );
  }
}
