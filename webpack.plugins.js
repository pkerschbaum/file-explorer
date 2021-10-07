const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  // setup copy plugin to copy static assets (https://gist.github.com/bbudd/2a246a718b7757584950b4ed98109115)
  new CopyWebpackPlugin({
    patterns: [{ from: path.resolve(__dirname, 'src', 'static'), to: 'static' }],
  }),
];
