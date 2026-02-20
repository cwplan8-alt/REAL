import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shared", "@repo/db", "@repo/analytics", "@repo/ui"],
};

export default nextConfig;
