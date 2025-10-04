/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Add any additional configuration here
  env: {
    CUSTOM_KEY: 'value',
  },
}

module.exports = nextConfig