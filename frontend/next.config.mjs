/** @type {import('next').NextConfig} */

// const CopyPlugin = require("copy-webpack-plugin");
// const path = require("path");
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.experiments.asyncWebAssembly = true;
    return config;
  },
};

export default nextConfig;
