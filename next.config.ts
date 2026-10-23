import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ["127.0.0.1"],
  output: "export",
  experimental: { inlineCss: true },
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};
export default config;
