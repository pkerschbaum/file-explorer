const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const SOURCE_PATH_OF_NODE_MODULES = path.resolve(__dirname, 'node_modules');
const WEBPACK_PATH = path.join('.');
const WEBPACK_PATH_OF_NODE_MODULES = path.join(WEBPACK_PATH, 'node_modules');

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

const SOURCE_PATH_OF_WORKER_SCRIPT = path.join(
  SOURCE_PATH_OF_NODE_MODULES,
  '@pkerschbaum',
  'code-oss-file-service',
  'out',
  'vs',
  'base',
  'node',
  'delete-recursive-using-child-process_child-script.js',
);
const WEBPACK_PATH_OF_WORKER_SCRIPT = path.join(
  WEBPACK_PATH,
  'delete-recursive-using-child-process_child-script.js',
);

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
          from: path.join(SOURCE_PATH_OF_NODE_MODULES, moduleName),
          to: path.join(WEBPACK_PATH_OF_NODE_MODULES, moduleName),
        },
      ],
    });
  }),

  new CopyWebpackPlugin({
    patterns: [
      {
        from: SOURCE_PATH_OF_WORKER_SCRIPT,
        to: WEBPACK_PATH_OF_WORKER_SCRIPT,
      },
    ],
  }),
];
