import type { StorybookConfig } from '@storybook/nextjs';
import { glob } from 'glob';
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

const config: StorybookConfig = {
  stories: getStories(),
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  staticDirs: ['../public'],

  framework: {
    name: '@storybook/nextjs',
    options: {},
  },

  previewHead: (head) => `
    ${head}
    <style>
      :root,
      body,
      #storybook-root {
        height: 100%;
      }
    </style>
  `,

  /**
   * - allow #pkg path alias (https://github.com/storybookjs/storybook/issues/11989#issuecomment-715524391)
   */
  webpackFinal: (config: any) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          ...moduleAliases,
        },
      },
    };
  },
};

module.exports = config;
