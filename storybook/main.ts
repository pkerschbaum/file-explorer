import path from 'path';

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],

  // allow @app path alias (https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391)
  webpackFinal: (config: any) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@app': path.resolve(__dirname, '../src/'),
        '@app-test': path.resolve(__dirname, '../test/'),
        '@app-storybook': path.resolve(__dirname, '../storybook/'),
      },
    },
  }),

  babel: (config: any) => ({
    ...config,
    plugins: [...config.plugins, 'babel-plugin-styled-components'],
  }),
};
