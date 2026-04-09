import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  // 👈 This enables static export
  devIndicators: {
    position: "top-right",
  },
  images: {
    unoptimized: true, // 👈 Required for static export when using next/image
    domains: ["api.coingecko.com"], // 👈 Allow loading images from CoinGecko
  },
};

export default nextConfig;