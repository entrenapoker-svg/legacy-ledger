import type { NextConfig } from "next";

// Static export so the app can be served from GitHub Pages or any file host.
// NEXT_PUBLIC_BASE_PATH is "/legacy-ledger" on GitHub Pages and empty locally.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;
