/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/upload',
        destination: 'http://backend:8080/upload',
      },
      {
        source: '/api/download/:port',
        destination: 'http://backend:8080/download/:port',
      },
    ];
  },
}

module.exports = nextConfig;
