import { Resend } from "resend";
import { SITE } from "@/lib/site";

// Lazy singleton so the module loads even when RESEND_API_KEY isn't set
// (e.g. on Vercel previews where we want the rest of the app to keep
// working).
let _resend: Resend | null | undefined;
function client(): Resend | null {
  if (_resend !== undefined) return _resend;
  _resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  return _resend;
}

const FROM_DEFAULT = process.env.EMAIL_FROM || `${SITE.name} <onboarding@resend.dev>`;
const REPLY_TO = process.env.EMAIL_REPLY_TO || SITE.email;

export type SendOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

// Sends transactional email via Resend. Returns null when Resend isn't
// configured — callers shouldn't fail the request if email fails.
export async function sendEmail(opts: SendOptions): Promise<{ id: string } | null> {
  const r = client();
  if (!r) {
    console.warn("[email] RESEND_API_KEY not set; skipping email", opts.subject);
    return null;
  }
  try {
    const res = await r.emails.send({
      from: FROM_DEFAULT,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: REPLY_TO,
    });
    if (res.error) {
      console.error("[email] Resend error", res.error);
      return null;
    }
    return { id: res.data?.id || "" };
  } catch (e) {
    console.error("[email] send failed", e);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Templates — simple HTML strings; safe for every email client.
// ---------------------------------------------------------------------------

const baseStyle = `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #0f172a; line-height: 1.6;`;
const buttonStyle = `display: inline-block; background: #1f5cf2; color: #ffffff; padding: 12px 22px; border-radius: 12px; text-decoration: none; font-weight: 600;`;

export function magicLinkHtml(url: string): string {
  return `
<div style="${baseStyle}">
  <h1 style="font-size: 22px; margin: 0 0 12px;">Sign in to ${SITE.name}</h1>
  <p>Click the button below to finish signing in. This link expires in 24 hours.</p>
  <p style="margin: 24px 0;"><a href="${url}" style="${buttonStyle}">Sign in to ${SITE.name}</a></p>
  <p style="color: #64748b; font-size: 13px;">If the button doesn't work, paste this link into your browser:</p>
  <p style="word-break: break-all; color: #475569; font-size: 13px;">${url}</p>
  <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">If you didn't request this, you can safely ignore this email.</p>
</div>`;
}

export function welcomeHtml(name?: string | null): string {
  const greeting = name ? `Hi ${escapeHtml(name)}` : "Hi there";
  return `
<div style="${baseStyle}">
  <h1 style="font-size: 24px; margin: 0 0 12px;">${greeting} — welcome to ${SITE.name}!</h1>
  <p>You can now use every PDF tool we offer, including the AI summarizer and Chat with PDF.</p>
  <p style="margin: 24px 0;">Three things to try first:</p>
  <ul style="padding-left: 20px;">
    <li><a href="${SITE.url}/tools/compress-pdf" style="color: #1f5cf2;">Compress a PDF</a> — shrink files for email and uploads</li>
    <li><a href="${SITE.url}/tools/ai-pdf-summarizer" style="color: #1f5cf2;">Summarize a PDF with AI</a> — get the gist in seconds</li>
    <li><a href="${SITE.url}/tools/chat-with-pdf" style="color: #1f5cf2;">Chat with a PDF</a> — ask questions about any document</li>
  </ul>
  <p style="margin: 24px 0;"><a href="${SITE.url}/dashboard" style="${buttonStyle}">Open your dashboard</a></p>
  <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">Reply to this email if you have questions — a real human reads every reply.</p>
</div>`;
}

export function fileReadyHtml(opts: { fileName: string; toolName: string; downloadUrl: string }): string {
  return `
<div style="${baseStyle}">
  <h1 style="font-size: 22px; margin: 0 0 12px;">Your ${escapeHtml(opts.toolName)} is ready</h1>
  <p style="color: #475569;">${escapeHtml(opts.fileName)}</p>
  <p style="margin: 24px 0;"><a href="${opts.downloadUrl}" style="${buttonStyle}">Download file</a></p>
  <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">This link is private to your account. Don't share it with people who shouldn't have access.</p>
</div>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] || c),
  );
}
