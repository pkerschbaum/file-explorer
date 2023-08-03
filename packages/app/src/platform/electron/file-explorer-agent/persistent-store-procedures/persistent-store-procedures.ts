import Store from 'electron-store';
import { z } from 'zod';

import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

const store = new Store();

export function createPersistentStoreProcedures() {
  return {
    readPersistedData: publicProcedure.query(() => store.store),

    persistData: publicProcedure
      .input(z.object({ data: z.record(z.unknown()) }))
      .mutation(({ input }) => {
        store.store = input.data;
      }),
  };
}
