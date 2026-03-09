/** @type {import('next').NextConfig} */
function buildCsp() {
  // CSP je namerno “praktičan” za Next.js (da ne polomi dev/prod),
  // ali i dalje daje realnu zaštitu (npr. frame-ancestors 'none', object-src 'none').
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  if (isDev) scriptSrc.push("'unsafe-eval'");

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' https: data:",
    "font-src 'self' https: data:",
    "connect-src 'self' https:",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ordering-app-iteh.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
      {
  protocol: "https",
  hostname: "via.placeholder.com",
  pathname: "/**",
},

      // (opciono) ako nekad dobiješ URL format bez regiona:
      {
        protocol: "https",
        hostname: "ordering-app-iteh.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    const csp = buildCsp();
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
