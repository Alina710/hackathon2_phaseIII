import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production builds
  reactStrictMode: true,

  // Disable telemetry to speed up builds
  telemetry: {
    enabled: false,
  },

  // Optimize images
  images: {
    unoptimized: true, // Disable image optimization for faster builds
  },

  // Output configuration
  output: 'standalone',
};

export default nextConfig;
