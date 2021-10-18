export type PlatformPersistentStorage = {
  write: (entireValue: Record<string, unknown>) => Promise<void>;
  read: () => Promise<Record<string, unknown>>;
};

export const createPersistentStorage = () => {
  const instance: PlatformPersistentStorage = {
    read: window.privileged.persistentDataStorage.read,
    write: window.privileged.persistentDataStorage.write,
  };

  return instance;
};
