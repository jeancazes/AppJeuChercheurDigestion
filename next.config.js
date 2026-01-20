/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuration pour Vercel
  images: {
    domains: [],
  },
  
  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_APP_NAME: 'Le Laboratoire Fabuleux',
    NEXT_PUBLIC_APP_VERSION: '7.0.0',
  },
}

module.exports = nextConfig
