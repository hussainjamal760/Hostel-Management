import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'grainy-gradients.vercel.app',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
