const rules = require('./webpack.rules');
const plugins = require('./webpack.renderer.plugins');
const path = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@app': path.resolve(__dirname, './src'),
      '@app-test': path.resolve(__dirname, './test'),
      '@app-storybook': path.resolve(__dirname, './storybook'),
    },
  },
};
