/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/casco-antiguo',
        destination: '/assessment/casco-antiguo'
      },
      {
        source: '/casco-antiguo/results',
        destination: '/teacher/casco-antiguo'
      }
    ];
  }
};

export default nextConfig;
