const nodeExternals = require("webpack-node-externals");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.target = "electron-renderer"; // Set target to electron-renderer

      // Exclude node_modules from the bundle except for certain modules
      webpackConfig.externals = [
        nodeExternals({
          allowlist: [/webpack(\/.*)?/, "electron-devtools-installer"],
        }),
      ];

      // Add rules to handle CSS files
      webpackConfig.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: /node_modules/,
      });

      return webpackConfig;
    },
  },
};
