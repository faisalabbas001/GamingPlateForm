const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  distDir: 'build', // Moved to the correct position
};

export default nextConfig;