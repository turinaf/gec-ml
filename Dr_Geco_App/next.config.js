/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Add node-loader for .node files
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    // Exclude ONNX runtime from client-side bundle if necessary
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push("onnxruntime-node");
    }

    return config;
  },
};

module.exports = nextConfig
