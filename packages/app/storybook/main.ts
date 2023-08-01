import glob from 'glob';
import path from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moduleAliases = require('../package-module-aliases');

/**
 * Exclude .png files from Storybook watcher so that Storybook does not reload when image snapshots
 * are created during test runs.
 * See also https://github.com/storybookjs/storybook/issues/11181#issuecomment-912549523
 */
const srcDirectory = path.resolve(__dirname, '..', 'src');
const getStories = () =>
  glob.sync(`${srcDirectory}/**/*.stories.@(js|jsx|ts|tsx)`, {
    ignore: `${srcDirectory}/**/*.png`,
  });

module.exports = {
  reactOptions: {
    // disable React StrictMode because @react-aria libs do not support it currently (https://github.com/adobe/react-spectrum/issues/779)
    strictMode: false,
  },

  stories: (list: any) => [...list, ...getStories()],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  staticDirs: ['../src/static'],

  /**
   * - allow #pkg path alias (https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391)
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
          ...moduleAliases,
        },
      },
    };
  },

  babel: (config: any) => ({
    ...config,
    plugins: [...config.plugins, 'babel-plugin-styled-components'],
  }),
};
