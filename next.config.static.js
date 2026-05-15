/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.BASE_PATH || "",
  assetPrefix: process.env.ASSET_PREFIX || undefined,
};

module.exports = nextConfig;
