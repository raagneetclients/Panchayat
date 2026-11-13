import type { NextConfig } from 'next';

const config: NextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  serverExternalPackages: ['@netlify/database', 'pg'],
};

export default config;
