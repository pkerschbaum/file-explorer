const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const LOCAL_STATIC_ASSETS_PATH = path.resolve(__dirname, 'src', 'static');

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  // setup copy plugin to copy static assets (https://gist.github.com/bbudd/2a246a718b7757584950b4ed98109115)
  new CopyWebpackPlugin({
    patterns: [
      {
        from: LOCAL_STATIC_ASSETS_PATH,
        to: 'static',
      },
    ],
  }),
];
