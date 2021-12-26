const path = require('path');
const plugins = require('./webpack.main.plugins');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      '@app': path.resolve(__dirname, './src'),
      '@app-test': path.resolve(__dirname, './test'),
      '@app-storybook': path.resolve(__dirname, './storybook'),
    },
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
