/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for the `pages` directory, default in `app`.
  swcMinify: true,
  experimental: {
    // Required:
    appDir: false,
  },
};

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  experimental: {
    nextScriptWorkers: true,
  },
});
