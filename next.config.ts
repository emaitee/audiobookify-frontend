import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  webpack: (config) => {
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx'];
    return config;
  }
};

export default nextConfig;
