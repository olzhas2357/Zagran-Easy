import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  experimental: {
    // Listening-видео проходит через Server Action и на API ограничено 50 МБ.
    // Небольшой запас нужен для multipart-обёртки; MIME и точный размер повторно
    // проверяются в NestJS перед записью в Storage.
    serverActions: {
      bodySizeLimit: "55mb",
    },
  },
};

export default nextConfig;
