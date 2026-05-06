/** @type {import('next').NextConfig} */

// Security headers applied to every response. We send conservative
// defaults so Google Safe Browsing / Microsoft Defender / scanners can
// see the site is hardened. CSP is intentionally permissive enough to
// let pdfjs (CDN worker) and Vercel Blob downloads keep working — we
// can tighten further once Stripe + Resend flows are confirmed clean.
// Content Security Policy — permissive enough for pdf.js (CDN worker),
// Stripe Checkout, Google Analytics, and Vercel Blob hosted assets;
// strict everywhere else. 'unsafe-inline' on scripts is required by
// next.js's runtime/inline scripts. We pair it with X-Frame-Options
// + X-Content-Type-Options so XSS exposure stays minimal in practice.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https: https://www.googletagmanager.com https://www.google-analytics.com",
  "media-src 'self' blob: data: https:",
  // connect-src allows the PDF.js worker to fetch PDFs from any HTTPS
  // origin (signed URLs from Vercel Blob, future S3 buckets, etc.) plus
  // blob: URLs that pdfjs creates internally for chunked reads.
  "connect-src 'self' https: blob: data: https://www.google-analytics.com https://api.openai.com https://api.stripe.com",
  "worker-src 'self' blob: https://cdn.jsdelivr.net",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
  // The site is never embedded in someone else's frame. Pairs with
  // X-Frame-Options below for older clients.
  "frame-ancestors 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Force HTTPS for two years on this domain + subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // CSP — see comment above.
  { key: "Content-Security-Policy", value: csp },
  // Block clickjacking attempts (older-client equivalent of frame-ancestors).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't sniff MIME types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer leakage to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Cross-origin isolation — prevents other origins from grabbing our
  // process for spectre-class attacks.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Disable powerful features we don't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self \"https://js.stripe.com\")",
  },
];

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["pdf-lib", "pdfjs-dist"],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
    ];
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
