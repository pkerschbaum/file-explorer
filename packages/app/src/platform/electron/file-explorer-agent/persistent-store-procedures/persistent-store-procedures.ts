import type Store from 'electron-store';
import { z } from 'zod';

import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

export function createPersistentStoreProcedures({ store }: { store: Store }) {
  return {
    readPersistedData: publicProcedure.query(() => {
      return store.store;
    }),

    persistData: publicProcedure
      .input(z.object({ data: z.record(z.unknown()) }))
      .mutation(({ input }) => {
        store.store = input.data;
      }),
  };
}
