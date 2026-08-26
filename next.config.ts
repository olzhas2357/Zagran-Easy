import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Дефолт 1MB мал для загрузки фото/презентаций через Server Actions (lib/staff-actions.ts → uploadUniversityFile).
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
