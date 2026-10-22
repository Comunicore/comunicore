import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.22'],
  reactStrictMode: true,
  output: process.env.NODE_ENV === 'development' ? undefined : 'export',
  trailingSlash: true,
  agentRules: false,
  images: {
    unoptimized: true, // <-- отключает серверную оптимизацию
  },
};

export default nextConfig;
