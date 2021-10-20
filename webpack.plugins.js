const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const LOCAL_STATIC_ASSETS_PATH = path.resolve(__dirname, 'src', 'static');
const CODE_OSS_FILE_ICON_THEME_LANGUAGES_PATH = path.resolve(
  __dirname,
  'node_modules',
  '@pkerschbaum',
  'code-oss-file-icon-theme',
  'static',
  'language-extensions',
);

module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  // setup copy plugin to copy static assets (https://gist.github.com/bbudd/2a246a718b7757584950b4ed98109115)
  new CopyWebpackPlugin({
    patterns: [
      {
        from: LOCAL_STATIC_ASSETS_PATH,
        to: 'static',
      },
      {
        from: CODE_OSS_FILE_ICON_THEME_LANGUAGES_PATH,
        to: path.join('static', 'icon-theme', 'language-extensions'),
      },
    ],
  }),
];
