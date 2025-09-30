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
      },
      {
        source: '/nissan-eng',
        destination: '/mockups/nissan/technical-architect-assessment'
      },
      {
        source: '/nissan-eng/results',
        destination: '/mockups/nissan/results'
      }
    ];
  }
};

export default nextConfig;
