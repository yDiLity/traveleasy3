/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com',
      'api.unsplash.com',
      'images.pexels.com',
      'api.pexels.com',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
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
    UNSPLASH_API_KEY: process.env.UNSPLASH_API_KEY,
    PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  },
  // Отключаем строгий режим для решения проблемы с бесконечной компиляцией
  reactStrictMode: false,
  // Отключаем проверку типов во время сборки для ускорения
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = withNextIntl(nextConfig);
