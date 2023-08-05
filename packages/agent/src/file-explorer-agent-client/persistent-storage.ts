import type { PlatformPersistentStorage } from '@file-explorer/platform/persistent-storage.types';

import { trpc } from '#pkg/file-explorer-agent-client/agent-client';

export const createPersistentStorage = () => {
  const instance: PlatformPersistentStorage = {
    read: trpc.persistentStore.readPersistedData.query,
    write: (data) => trpc.persistentStore.persistData.mutate({ data }),
  };

  return instance;
};
