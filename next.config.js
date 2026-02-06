/** @type {import('next').NextConfig} */
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
};

module.exports = nextConfig;
