import { setGlobalModules } from '@app/operations/global-modules';
import { createFakeFileIconThemeLoader } from '@app/platform/fake/file-icon-theme-loader';
import type { CreateFakeFileSystemArgs } from '@app/platform/fake/file-system';
import { createFakeFileSystem } from '@app/platform/fake/file-system';
import { createNoopLogWriter } from '@app/platform/fake/log-writer';
import { createFakeNativeHost } from '@app/platform/fake/native-host';
import { createFakePersistentStorage } from '@app/platform/fake/persistent-storage';

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