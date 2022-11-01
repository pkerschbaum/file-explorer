const rules = require('./webpack.rules');
const plugins = require('./webpack.renderer.plugins');
const path = require('path');
const moduleAliases = require('./package-module-aliases');

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
    alias: moduleAliases,
  },
};
