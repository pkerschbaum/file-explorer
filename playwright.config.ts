import * as platform from '@pkerschbaum/code-oss-file-service/out/vs/base/common/platform';
import { devices, PlaywrightTestConfig } from '@playwright/test';
import moduleAlias from 'module-alias';

import moduleAliases from './package-module-aliases';

// allow module aliases (https://github.com/microsoft/playwright/issues/7066#issuecomment-983984496)
moduleAlias.addAliases(moduleAliases);

/**
 * The Chrome device descriptor of Playwright has "Windows" hard-coded as user agent.
 * Adapt that to the actual platform the test cases are executed on.
 */
const deviceDescriptorToUse = devices['Desktop Chrome'];
if (platform.isLinux) {
  deviceDescriptorToUse.userAgent = deviceDescriptorToUse.userAgent.replace('Windows', 'Linux');
} else if (platform.isMacintosh) {
  deviceDescriptorToUse.userAgent = deviceDescriptorToUse.userAgent.replace('Windows', 'Macintosh');
}

const config: PlaywrightTestConfig = {
  testMatch: [/\.logic\.spec\.ts/i, /\.visual\.spec\.ts/i],
  projects: [
    {
      name: 'chromium',
      use: { ...deviceDescriptorToUse },
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

export default config;
