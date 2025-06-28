/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/encanto-ai',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
