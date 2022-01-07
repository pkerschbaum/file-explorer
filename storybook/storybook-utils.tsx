import { setGlobalModules } from '@app/operations/global-modules';
import { createLogWriter } from '@app/platform/browser/log-writer';
import { createStorybookFileIconThemeLoader } from '@app/platform/storybook/file-icon-theme-loader';

import {
  initializeFakePlatformModules,
  InitializeFakePlatformModulesArgs,
} from '@app-test/utils/fake-platform-modules';

export async function initializeStorybookPlatformModules(args?: InitializeFakePlatformModulesArgs) {
  await initializeFakePlatformModules(args);
  setGlobalModules({
    fileIconThemeLoader: createStorybookFileIconThemeLoader(),
    logWriter: createLogWriter(),
  });
}
