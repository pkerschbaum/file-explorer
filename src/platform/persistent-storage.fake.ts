import { PlatformPersistentStorage } from '@app/platform/persistent-storage';

export function createFakePersistentStorage(): PlatformPersistentStorage {
  let currentValue: Record<string, unknown> = {};
  return {
    read: () => Promise.resolve(currentValue),
    write: (entireValue) => {
      currentValue = entireValue;
      return Promise.resolve();
    },
  };
}
