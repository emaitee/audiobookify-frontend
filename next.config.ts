import webpack from 'webpack';
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
  skipWaiting: true,
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


interface ImageConfig {
  domains: string[];
  // formats?: string[];
}

interface WebpackConfig {
  plugins: webpack.WebpackPluginInstance[];
}

interface RuntimeCachingOptions {
  cacheName: string;
  expiration: {
    maxEntries: number;
    maxAgeSeconds: number;
  };
  cacheableResponse: {
    statuses: number[];
  };
  rangeRequests: boolean;
}

interface RuntimeCaching {
  urlPattern: RegExp;
  handler: string;
  options: RuntimeCachingOptions;
}

interface PWAConfig {
  dest: string;
  disable: boolean;
  register: boolean;
  skipWaiting: boolean;
  scope: string;
  sw: string;
  runtimeCaching: RuntimeCaching[];
}

const nextConfig: NextConfig = withPWA({
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'localhost'
    ],
    // formats: [
    //   'image/avif', 
    //   'image/webp'
    // ]
  } as ImageConfig,
  webpack: (config: WebpackConfig) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.VAPID_PUBLIC_KEY': JSON.stringify(process.env.VAPID_PUBLIC_KEY),
      })
    );
    return config;
  }
});

export default withNextIntl(nextConfig);
