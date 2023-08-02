import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';
import type Store from 'electron-store';

import { createAppProcedures } from '#pkg/platform/electron/file-explorer-agent/app-procedures/app-procedures';
import { createClipboardProcedures } from '#pkg/platform/electron/file-explorer-agent/clipboard-procedures/clipboard-procedures';
import {
  PORT_PUSH_SERVER,
  PORT_TRPC_SERVER,
} from '#pkg/platform/electron/file-explorer-agent/constants';
import { createFsProcedures } from '#pkg/platform/electron/file-explorer-agent/fs-procedures/fs-procedures';
import { createPersistentStoreProcedures } from '#pkg/platform/electron/file-explorer-agent/persistent-store-procedures/persistent-store-procedures';
import { PushServer } from '#pkg/platform/electron/file-explorer-agent/push-server';
import { createShellProcedures } from '#pkg/platform/electron/file-explorer-agent/shell-procedures/shell-procedures';
import { router } from '#pkg/platform/electron/file-explorer-agent/trcp-router';
import {
  createWindowProcedures,
  WindowRef,
} from '#pkg/platform/electron/file-explorer-agent/window-procedures/window-procedures';

const pushServer = new PushServer();

export type AppRouter = ReturnType<typeof createFileExplorerAgent>['appRouter'];

export function createFileExplorerAgent({
  store,
  windowRef,
}: {
  store: Store;
  windowRef: WindowRef;
}) {
  const appRouter = router({
    app: router(createAppProcedures()),
    clipboard: router(createClipboardProcedures()),
    fs: router(createFsProcedures({ pushServer })),
    persistentStore: router(createPersistentStoreProcedures({ store })),
    shell: router(createShellProcedures()),
    window: router(createWindowProcedures({ windowRef })),
  });

  const trpcServer = createHTTPServer({
    router: appRouter,
    middleware: cors(),
  });

  return {
    appRouter,
    listen() {
      pushServer.listen(PORT_PUSH_SERVER);
      trpcServer.listen(PORT_TRPC_SERVER);
    },
  };
}
