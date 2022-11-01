const rules = require('./webpack.rules');
const plugins = require('./webpack.main.plugins');
const moduleAliases = require('./package-module-aliases');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: moduleAliases,
  },
  /**
   * "sharp" does not get packaged correctly in this electron/electron-forge setup.
   * That's why we define it as an external dependency (and copy the node module manually to the
   * output folder, see webpack.main.plugins.js)
   * @see https://github.com/lovell/sharp/issues/1951
   */
  externals: {
    sharp: 'commonjs sharp',
  },
};
