import { setGlobalModules } from '#pkg/operations/global-modules';
import { createFakeFileIconThemeLoader } from '#pkg/platform/fake/file-icon-theme-loader';
import type { CreateFakeFileSystemArgs } from '#pkg/platform/fake/file-system';
import { createFakeFileSystem } from '#pkg/platform/fake/file-system';
import { createNoopLogWriter } from '#pkg/platform/fake/log-writer';
import { createFakeNativeHost } from '#pkg/platform/fake/native-host';
import { createFakePersistentStorage } from '#pkg/platform/fake/persistent-storage';

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
