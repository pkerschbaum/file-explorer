import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from 'cors';

import {
  PORT_PUSH_SERVER,
  PORT_TRPC_SERVER,
} from '#pkg/platform/electron/file-explorer-agent/constants';
import { createFsProcedures } from '#pkg/platform/electron/file-explorer-agent/fs-procedures/impl';
import { PushServer } from '#pkg/platform/electron/file-explorer-agent/push-server';
import { createShellProcedures } from '#pkg/platform/electron/file-explorer-agent/shell-procedures/impl';
import { router } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

const pushServer = new PushServer();

const appRouter = router({
  fs: router(createFsProcedures({ pushServer })),
  shell: router(createShellProcedures()),
});
export type AppRouter = typeof appRouter;

const trpcServer = createHTTPServer({
  router: appRouter,
  middleware: cors(),
});

export function startFileExplorerAgent() {
  pushServer.listen(PORT_PUSH_SERVER);
  trpcServer.listen(PORT_TRPC_SERVER);
}
