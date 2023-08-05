import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import http from 'node:http';

import { AGENT_PORT, TRPC_SERVER_BASE_PATH } from '#pkg/constants';
import { createAppProcedures } from '#pkg/file-explorer-agent/app-procedures/app-procedures';
import { registerBlobRoutes } from '#pkg/file-explorer-agent/blob';
import { createClipboardProcedures } from '#pkg/file-explorer-agent/clipboard-procedures/clipboard-procedures';
import { createFsProcedures } from '#pkg/file-explorer-agent/fs-procedures/fs-procedures';
import { createNativeDNDProcedures } from '#pkg/file-explorer-agent/native-dnd-procedures/native-dnd-procedures';
import { createPersistentStoreProcedures } from '#pkg/file-explorer-agent/persistent-store-procedures/persistent-store-procedures';
import { PushServer } from '#pkg/file-explorer-agent/push-server';
import { createShellProcedures } from '#pkg/file-explorer-agent/shell-procedures/shell-procedures';
import { router } from '#pkg/file-explorer-agent/trcp-router';

export type AppRouter = Awaited<ReturnType<typeof createFileExplorerAgent>>['appRouter'];

export async function createFileExplorerAgent() {
  const app = express();
  app.use(cors());

  const server = http.createServer(app);

  const pushServer = new PushServer(server);

  const nativeDNDProcedures = await createNativeDNDProcedures();

  const appRouter = router({
    app: router(createAppProcedures()),
    clipboard: router(createClipboardProcedures({ pushServer })),
    fs: router(createFsProcedures({ pushServer })),
    persistentStore: router(createPersistentStoreProcedures()),
    shell: router(createShellProcedures()),
    nativeDND: router(nativeDNDProcedures),
  });

  app.use(
    TRPC_SERVER_BASE_PATH,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    }),
  );

  registerBlobRoutes(app);

  return {
    appRouter,
    listen() {
      server.listen(AGENT_PORT);
    },
  };
}
