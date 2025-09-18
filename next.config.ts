import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // For GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' && process.env.GITHUB_ACTIONS ? '/Stera-Site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.GITHUB_ACTIONS ? '/Stera-Site/' : '',
};

export default nextConfig;
