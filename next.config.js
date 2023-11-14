/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  experimental: {
    serverActions: true,
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['mongoose'],
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  // webpack: (config) => {
  //   config.experiments = {
  //     topLevelAwait: true,
  //   };
  //   return config;
  // },
};

module.exports = nextConfig;
