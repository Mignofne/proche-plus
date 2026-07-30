import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@prisma/client"],
  },
  // Accélère la navigation perçue en prod / preview
  poweredByHeader: false,
};

export default nextConfig;
