import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем оптимизацию изображений
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    minimumCacheTTL: 60,
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Оптимизация производительности
  experimental: {
    optimizeCss: false, // Отключаем оптимизацию CSS, так как она требует critters
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Оптимизация сборки
  swcMinify: true,

  // Кэширование
  onDemandEntries: {
    // Период, в течение которого страница должна оставаться в памяти (в мс)
    maxInactiveAge: 60 * 1000,
    // Количество страниц, которые должны оставаться в памяти
    pagesBufferLength: 5,
  },

  // Оптимизация для продакшена
  productionBrowserSourceMaps: false,

  // Оптимизация для разработки
  reactStrictMode: true,

  // Настройка заголовков для кэширования
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=3600, stale-while-revalidate=3600',
          },
        ],
      },
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
