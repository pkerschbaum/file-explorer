import type { PlatformPersistentStorage } from '@app/platform/persistent-storage.types';

export const createPersistentStorage = () => {
  const instance: PlatformPersistentStorage = {
    read: window.privileged.persistentDataStorage.read,
    write: window.privileged.persistentDataStorage.write,
  };

  return instance;
};
