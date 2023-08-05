const path = require('path');

const moduleAliases = {
  '#pkg': path.resolve(__dirname, './src'),
  '#pkg-test': path.resolve(__dirname, './test'),
  '#pkg-storybook': path.resolve(__dirname, './storybook'),
  '#pkg-playwright': path.resolve(__dirname, './playwright'),
};

module.exports = moduleAliases;
