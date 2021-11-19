import { fileSystemRef, nativeHostRef, persistentStorageRef } from '@app/operations/global-modules';
import { createFakeFileSystem } from '@app/platform/file-system.fake';
import { createFakeNativeHost } from '@app/platform/native-host.fake';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';

export async function initializeFakePlatformModules() {
  fileSystemRef.current = await createFakeFileSystem();
  nativeHostRef.current = createFakeNativeHost();
  persistentStorageRef.current = createFakePersistentStorage();
}
