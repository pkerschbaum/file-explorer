import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import express from 'express';
import http from 'node:http';

import { createAppProcedures } from '#pkg/platform/electron/file-explorer-agent/app-procedures/app-procedures';
import { createClipboardProcedures } from '#pkg/platform/electron/file-explorer-agent/clipboard-procedures/clipboard-procedures';
import {
  AGENT_PORT,
  TRPC_SERVER_BASE_PATH,
} from '#pkg/platform/electron/file-explorer-agent/constants';
import { createFsProcedures } from '#pkg/platform/electron/file-explorer-agent/fs-procedures/fs-procedures';
import { createPersistentStoreProcedures } from '#pkg/platform/electron/file-explorer-agent/persistent-store-procedures/persistent-store-procedures';
import { registerProtocols } from '#pkg/platform/electron/file-explorer-agent/protocol';
import { PushServer } from '#pkg/platform/electron/file-explorer-agent/push-server';
import { createShellProcedures } from '#pkg/platform/electron/file-explorer-agent/shell-procedures/shell-procedures';
import { router } from '#pkg/platform/electron/file-explorer-agent/trcp-router';
import {
  createWindowProcedures,
  WindowRef,
} from '#pkg/platform/electron/file-explorer-agent/window-procedures/window-procedures';

export type AppRouter = ReturnType<typeof createFileExplorerAgent>['appRouter'];

export function createFileExplorerAgent({ windowRef }: { windowRef: WindowRef }) {
  const app = express();
  app.use(cors());

  const server = http.createServer(app);

  const pushServer = new PushServer(server);

  const appRouter = router({
    app: router(createAppProcedures()),
    clipboard: router(createClipboardProcedures()),
    fs: router(createFsProcedures({ pushServer })),
    persistentStore: router(createPersistentStoreProcedures()),
    shell: router(createShellProcedures()),
    window: router(createWindowProcedures({ windowRef })),
  });

  app.use(
    `/${TRPC_SERVER_BASE_PATH}`,
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    }),
  );

  registerProtocols(app);

  return {
    appRouter,
    listen() {
      server.listen(AGENT_PORT);
    },
  };
}
