/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // El Service Worker nunca debe quedar cacheado por el navegador
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
