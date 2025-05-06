import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  experimental: {
    createMessagesDeclaration: './messages/en.json'
  }
});

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // optional: uncomment to enable additional PWA features
  register: true,
  scope: '/app',
  sw: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: /\/api\/audio\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'audio-cache',
        expiration: {
          maxEntries: 50, // Cache 50 most recent audiobook segments
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200, 206]
        },
        rangeRequests: true // Critical for audio streaming
      }
    }
  ]
})


const nextConfig: NextConfig = withPWA({
  /* config options here */
  reactStrictMode: true,
});

export default withNextIntl(nextConfig);
