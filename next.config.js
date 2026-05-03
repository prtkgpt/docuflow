/** @type {import('next').NextConfig} */

// Security headers applied to every response. We send conservative
// defaults so Google Safe Browsing / Microsoft Defender / scanners can
// see the site is hardened. CSP is intentionally permissive enough to
// let pdfjs (CDN worker) and Vercel Blob downloads keep working — we
// can tighten further once Stripe + Resend flows are confirmed clean.
const securityHeaders = [
  // Force HTTPS for two years on this domain + subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Block clickjacking attempts.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Don't sniff MIME types.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer leakage to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable powerful features we don't use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
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
