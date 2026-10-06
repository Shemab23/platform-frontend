import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";
    const cleanBackendUrl = backendUrl.replace(/\/\$/, "");

    return [
      {
        // 1. Catches /api/tenant/config and sends it to your backend
        source: "/api/:path*",
        destination: `${cleanBackendUrl}/api/:path*`,
      },
      {
        // 2. Catches /health explicitly and sends it straight to your backend
        source: "/health",
        destination: `${cleanBackendUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
