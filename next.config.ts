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
  // sw: 'service-worker.js',
  //...
})


const nextConfig: NextConfig = withPWA({
  /* config options here */
  reactStrictMode: true,
});

export default withNextIntl(nextConfig);
