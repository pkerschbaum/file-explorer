const path = require('path');

const moduleAliases = {
  '@app': path.resolve(__dirname, './src'),
  '@app-test': path.resolve(__dirname, './test'),
  '@app-storybook': path.resolve(__dirname, './storybook'),
  '@app-playwright': path.resolve(__dirname, './playwright'),
};

module.exports = moduleAliases;
