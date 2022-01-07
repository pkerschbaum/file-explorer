// @ts-check
const { devices } = require('@playwright/test');
const moduleAlias = require('module-alias');
const moduleAliases = require('./package-module-aliases');

moduleAlias.addAliases(moduleAliases);

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testMatch: [/\.logic\.spec\.ts/i, /\.visual\.spec\.ts/i],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  expect: {
    toMatchSnapshot: {
      threshold: 0.3,
    },
  },
  use: {
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
};

module.exports = config;
