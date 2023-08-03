import { trpc } from '#pkg/platform/electron/file-explorer-agent-client/agent-client';
import type { PlatformPersistentStorage } from '#pkg/platform/persistent-storage.types';

export const createPersistentStorage = () => {
  const instance: PlatformPersistentStorage = {
    read: trpc.persistentStore.readPersistedData.query,
    write: (data) => trpc.persistentStore.persistData.mutate({ data }),
  };

  return instance;
};
