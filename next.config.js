/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images.pexels.com", // ✅ For your product images
      "lh3.googleusercontent.com", // ✅ If you use Google login/profile photos
      "tojuoimeuvlrlihqfhzr.supabase.co", // ✅ Replace with your actual Supabase project domain
    ],
  },
};

module.exports = withPWA(nextConfig);
