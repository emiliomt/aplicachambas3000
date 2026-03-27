import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pg", "@prisma/adapter-pg"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
