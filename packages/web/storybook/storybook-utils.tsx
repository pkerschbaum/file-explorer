import { createFileIconThemeLoader } from '@file-explorer/agent/file-explorer-agent-client/file-icon-theme-loader';
import { createLogWriter } from '@file-explorer/platform/browser/log-writer';

import { setGlobalModules } from '#pkg/operations/global-modules';

import type { InitializeFakePlatformModulesArgs } from '#pkg-test/utils/fake-platform-modules';
import { initializeFakePlatformModules } from '#pkg-test/utils/fake-platform-modules';

export async function initializeStorybookPlatformModules(args?: InitializeFakePlatformModulesArgs) {
  await initializeFakePlatformModules(args);
  setGlobalModules({
    fileIconThemeLoader: createFileIconThemeLoader(),
    logWriter: createLogWriter(),
  });
}
