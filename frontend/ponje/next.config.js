/** @type {import('next').NextConfig} */
const dotenv = require("dotenv");

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [{ hostname: "**" }],
  },
  async rewrites() {
    return [
      {
        source: '/(p|P)(r|R)(o|O)(f|F)(i|I)(l|L)(e|E)',
        destination: '/profile',
      },
    ]
  },
};

module.exports = nextConfig;

