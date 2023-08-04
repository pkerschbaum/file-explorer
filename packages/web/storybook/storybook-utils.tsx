import { createLogWriter } from '@file-explorer/platform/browser/log-writer';

import { setGlobalModules } from '#pkg/operations/global-modules';
import { createStorybookFileIconThemeLoader } from '#pkg/platform/storybook/file-icon-theme-loader';

import type { InitializeFakePlatformModulesArgs } from '#pkg-test/utils/fake-platform-modules';
import { initializeFakePlatformModules } from '#pkg-test/utils/fake-platform-modules';

export async function initializeStorybookPlatformModules(args?: InitializeFakePlatformModulesArgs) {
  await initializeFakePlatformModules(args);
  setGlobalModules({
    fileIconThemeLoader: createStorybookFileIconThemeLoader(),
    logWriter: createLogWriter(),
  });
}
