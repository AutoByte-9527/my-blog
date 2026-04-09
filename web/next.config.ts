import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 禁用 Turbopack，使用传统 webpack
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
