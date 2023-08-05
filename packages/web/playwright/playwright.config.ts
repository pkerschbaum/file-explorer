/* eslint-disable import/no-default-export, @typescript-eslint/no-var-requires */
import type { PlaywrightTestConfig } from '@playwright/test';
import moduleAlias from 'module-alias';

const moduleAliases: { [alias: string]: string } = require('../package-module-aliases');

// allow module aliases (https://github.com/microsoft/playwright/issues/7066#issuecomment-983984496)
moduleAlias.addAliases(moduleAliases);

const config: PlaywrightTestConfig = {
  testMatch: [/\.logic\.spec\.ts/i, /\.visual\.spec\.ts/i],
  testDir: '..',
  projects: [{ name: 'chromium' }],
  expect: {
    toMatchSnapshot: {
      threshold: 0.1,
    },
  },
  use: {
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
};

export default config;
