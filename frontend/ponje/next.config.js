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
};

module.exports = nextConfig;

