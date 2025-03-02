/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com", // For GitHub avatar images
      "lh3.googleusercontent.com", // For Google avatar images
      "hebbkx1anhila5yf.public.blob.vercel-storage.com", // For your Vercel Blob storage
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

