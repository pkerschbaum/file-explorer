import { createFakeFileIconThemeLoader } from '@file-explorer/platform/fake/file-icon-theme-loader';
import type { CreateFakeFileSystemArgs } from '@file-explorer/platform/fake/file-system';
import { createFakeFileSystem } from '@file-explorer/platform/fake/file-system';
import { createNoopLogWriter } from '@file-explorer/platform/fake/log-writer';
import { createFakeNativeHost } from '@file-explorer/platform/fake/native-host';
import { createFakePersistentStorage } from '@file-explorer/platform/fake/persistent-storage';

import { setGlobalModules } from '#pkg/operations/global-modules';

export type InitializeFakePlatformModulesArgs = {
  createFileSystemArgs: CreateFakeFileSystemArgs;
};

export async function initializeFakePlatformModules(args?: InitializeFakePlatformModulesArgs) {
  setGlobalModules({
    fileIconThemeLoader: createFakeFileIconThemeLoader(),
    fileSystem: await createFakeFileSystem(args?.createFileSystemArgs),
    logWriter: createNoopLogWriter(),
    nativeHost: createFakeNativeHost(),
    persistentStorage: createFakePersistentStorage(),
  });
}
