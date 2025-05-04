/** @type {import('next').NextConfig} */
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
}

module.exports = nextConfig
