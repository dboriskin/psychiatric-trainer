/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['via.placeholder.com'],
  },
  // Disable static export since we're deploying as a Mini App
  output: 'standalone',
}

module.exports = nextConfig