const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SHARP_NODE_MODULES_TO_COPY = [
  'sharp',
  'color',
  'color-convert',
  'color-name',
  'color-string',
  'detect-libc',
  'simple-swizzle',
  'semver',
];
const NODE_MODULES_BASE_PATH = path.resolve(__dirname, 'node_modules');
const NODE_MODULES_TARGET_PATH = path.join('.', 'node_modules');

module.exports = [
  /**
   * "sharp" does not get packaged correctly in this electron/electron-forge setup.
   * That's why we copy the node module (and all of its dependencies) manually to the output folder
   * @see https://github.com/lovell/sharp/issues/1951
   */
  ...SHARP_NODE_MODULES_TO_COPY.map((moduleName) => {
    return new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(NODE_MODULES_BASE_PATH, moduleName),
          to: path.join(NODE_MODULES_TARGET_PATH, moduleName),
        },
      ],
    });
  }),
];
