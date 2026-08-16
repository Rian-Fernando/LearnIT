import type { NextConfig } from "next";

/**
 * Security headers applied to every response.
 *
 * Content-Security-Policy is deliberately NOT set here. A correct policy needs
 * either a per-request nonce or a hash for the inline scripts Next.js emits,
 * and the nonce approach forces every route into dynamic rendering. That is a
 * real cost for a mostly-static application, and the decision belongs to
 * whoever operates the deployment.
 *
 * docs/security.md carries a ready-to-apply policy for the reverse proxy,
 * including the hash for the theme bootstrap script.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // lucide-react is a large barrel; letting Next tree-shake it keeps the
  // client bundle lean.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
