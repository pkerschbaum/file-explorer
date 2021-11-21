import {
  fileIconThemeLoaderRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
} from '@app/operations/global-modules';
import { createFakeFileIconThemeLoader } from '@app/platform/file-icon-theme-loader.fake';
import { createFakeFileSystem } from '@app/platform/file-system.fake';
import { createFakeNativeHost } from '@app/platform/native-host.fake';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';

export async function initializeFakePlatformModules() {
  fileIconThemeLoaderRef.current = createFakeFileIconThemeLoader();
  fileSystemRef.current = await createFakeFileSystem();
  nativeHostRef.current = createFakeNativeHost();
  persistentStorageRef.current = createFakePersistentStorage();
}
