import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.22'],
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true, // <-- отключает серверную оптимизацию
  },
};

export default nextConfig;
