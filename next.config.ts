import type { NextConfig } from "next";
const config: NextConfig = {
  turbopack: { root: process.cwd() },
  allowedDevOrigins: ["127.0.0.1"],
  output: "export",
  experimental: {
    inlineCss: true,
    // Keep the small Synapse loading layout independently prefetchable instead
    // of bundling it into the page payload that navigation is waiting for.
    prefetchInlining: { maxSize: 512 },
  },
  trailingSlash: true,
  images: { unoptimized: true },
  // This repository is public. Publish maps for production diagnostics without
  // adding them to the assets downloaded during normal page navigation.
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
};
export default config;
