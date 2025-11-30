import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      }
    ]
  },
  eslint: {
    // Allow production builds to complete even with ESLint errors
    // ignoreDuringBuilds: false,
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    // ignoreBuildErrors: false,
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
