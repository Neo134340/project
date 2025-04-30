import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.wconcept.com',
        port: '',
        pathname: '/products/resize/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      // คุณสามารถเพิ่ม hostname อื่นๆ ได้ที่นี่ ถ้ามีรูปภาพจากแหล่งอื่นอีก
    ],
  },
};

export default nextConfig;