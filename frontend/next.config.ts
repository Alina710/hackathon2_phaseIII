import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production builds
  reactStrictMode: true,

  // Optimize images
  images: {
    unoptimized: true, // Disable image optimization for faster builds
  },

  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable Turbopack for production (use webpack)
  experimental: {
    turbo: undefined,
  },
};

export default nextConfig;
