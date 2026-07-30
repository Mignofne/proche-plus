import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep Prisma out of the Next bundler so the query engine binary is available at runtime on Vercel
  serverExternalPackages: ["@prisma/client", "prisma"],
  // Accélère la navigation perçue en prod / preview
  poweredByHeader: false,
};

export default nextConfig;
