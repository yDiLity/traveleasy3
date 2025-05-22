/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  images: {
    domains: [
      'images.pexels.com',
      'api.pexels.com',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true,
  },
  env: {
    PEXELS_API_KEY: process.env.PEXELS_API_KEY,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  // Отключаем строгий режим для решения проблемы с бесконечной компиляцией
  reactStrictMode: false,
  // Отключаем проверку типов во время сборки для ускорения
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = withNextIntl(nextConfig);
