import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for production builds
  reactStrictMode: true,

  // Optimize images
  images: {
    unoptimized: true, // Disable image optimization for faster builds
  },

  // Output configuration for Vercel
  output: 'standalone',

  // Disable TypeScript errors during build (optional - remove if you want strict checking)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
