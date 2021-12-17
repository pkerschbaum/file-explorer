import {
  fileIconThemeLoaderRef,
  fileSystemRef,
  logWriterRef,
  nativeHostRef,
  persistentStorageRef,
} from '@app/operations/global-modules';
import { createFakeFileIconThemeLoader } from '@app/platform/fake/file-icon-theme-loader';
import { createFakeFileSystem, CreateFakeFileSystemArgs } from '@app/platform/fake/file-system';
import { createNoopLogWriter } from '@app/platform/fake/log-writer';
import { createFakeNativeHost } from '@app/platform/fake/native-host';
import { createFakePersistentStorage } from '@app/platform/fake/persistent-storage';

export type InitializeFakePlatformModulesArgs = {
  createFileSystemArgs: CreateFakeFileSystemArgs;
};

export async function initializeFakePlatformModules(args?: InitializeFakePlatformModulesArgs) {
  fileIconThemeLoaderRef.current = createFakeFileIconThemeLoader();
  fileSystemRef.current = await createFakeFileSystem(args?.createFileSystemArgs);
  logWriterRef.current = createNoopLogWriter();
  nativeHostRef.current = createFakeNativeHost();
  persistentStorageRef.current = createFakePersistentStorage();
}
