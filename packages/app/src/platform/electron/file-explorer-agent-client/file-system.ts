import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { io } from 'socket.io-client';

import {
  PORT_TRPC_SERVER,
  PORT_PUSH_SERVER,
} from '#pkg/platform/electron/file-explorer-agent/constants';
import type { AppRouter } from '#pkg/platform/electron/file-explorer-agent/initialize-file-explorer-agent';

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `http://localhost:${PORT_TRPC_SERVER}`,
    }),
  ],
});
export const pushSocket = io(`http://localhost:${PORT_PUSH_SERVER}`);
