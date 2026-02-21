/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true }, // Required for static export
  trailingSlash: true,
};

module.exports = nextConfig;
