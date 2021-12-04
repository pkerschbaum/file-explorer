import path from 'path';

module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  staticDirs: ['../src/static'],

  /**
   * - allow @app path alias (https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391)
   * - workaround for framer-motion issue (https://github.com/framer/motion/issues/1307#issuecomment-954046207)
   */
  webpackFinal: (config: any) => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
          },
        ],
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@app': path.resolve(__dirname, '../src/'),
          '@app-test': path.resolve(__dirname, '../test/'),
          '@app-storybook': path.resolve(__dirname, '../storybook/'),
        },
      },
    };
  },

  babel: (config: any) => ({
    ...config,
    plugins: [...config.plugins, 'babel-plugin-styled-components'],
  }),
};
