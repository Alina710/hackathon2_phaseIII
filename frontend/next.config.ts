import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production builds
  reactStrictMode: true,

  // Optimize images
  images: {
    unoptimized: true,
  },

  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
