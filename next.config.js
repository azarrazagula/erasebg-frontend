/** 
 * Next.js Application Configuration
 * @type {import('next').NextConfig} 
 */
const nextConfig = {
  // Enables React Strict Mode for detecting side effects and deprecated API usages in development
  reactStrictMode: true,
  
  // Custom configurations for the next/image optimizer component
  images: {
    // Whitelist Unsplash domain for loading preset gallery examples safely
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
