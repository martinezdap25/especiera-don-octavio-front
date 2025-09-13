/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig;
