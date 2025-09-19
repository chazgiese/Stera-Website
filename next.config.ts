import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles optimization automatically
  images: {
    // Enable image optimization for Vercel
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
