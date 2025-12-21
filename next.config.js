/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Build a standalone server in `.next/standalone` which can be deployed
  // as a self-contained Node.js app behind nginx.
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  // Add any additional configuration here
  env: {
    CUSTOM_KEY: 'value',
    // Core service base URL (configurable via environment). Defaults to localhost for local dev.
    CORE_SERVICE_URL: process.env.CORE_SERVICE_URL || 'http://localhost:8081',
    // Also expose a public var in case client-side code needs to call the BFF (optional)
    NEXT_PUBLIC_CORE_SERVICE_URL: process.env.NEXT_PUBLIC_CORE_SERVICE_URL || process.env.CORE_SERVICE_URL || 'http://localhost:8081',
  },
}

module.exports = nextConfig