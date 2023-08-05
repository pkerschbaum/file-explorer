// @ts-check

/** @type {import('next').NextConfig} */
let nextConfig = {
  distDir: 'dist',
  reactStrictMode: true,

  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  compiler: {
    styledComponents: true,
  },

  webpack(config) {
    // moduleResolution: node16 support for Next.js (https://github.com/vercel/next.js/discussions/41189#discussioncomment-4026895)
    config.resolve.extensionAlias = {
      ...config.resolve.extensionAlias,
      '.js': ['.js', '.ts'],
      '.jsx': ['.jsx', '.tsx'],
    };
    return config;
  },
};

module.exports = nextConfig;
