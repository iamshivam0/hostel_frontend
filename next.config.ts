import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: true,

};

export default withPWA({
  dest: 'public',
  registerType: "autoUpdate",
  workbox: {
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  },
  manifest: {
    name: "HMS",
    short_name: "HMS",
    start_url: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#111827",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  skipWaiting: true,
})(nextConfig);
