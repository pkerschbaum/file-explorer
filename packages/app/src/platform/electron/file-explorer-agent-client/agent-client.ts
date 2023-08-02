import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { io } from 'socket.io-client';
import superjson from 'superjson';

import {
  PORT_TRPC_SERVER,
  PORT_PUSH_SERVER,
  PUSH_EVENT,
} from '#pkg/platform/electron/file-explorer-agent/constants';
import type { AppRouter } from '#pkg/platform/electron/file-explorer-agent/initialize-file-explorer-agent';
import type { PushEvent } from '#pkg/platform/electron/file-explorer-agent/push-server';

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `http://localhost:${PORT_TRPC_SERVER}`,
    }),
  ],
});
const ioSocket = io(`http://localhost:${PORT_PUSH_SERVER}`);
export const pushSocket = {
  on<PushEventType extends keyof PushServer.PushEventMap>(
    pushEventType: PushEventType,
    listener: (payload: PushServer.PushEventMap[PushEventType]) => void,
  ) {
    ioSocket.on(PUSH_EVENT, (event: PushEvent) => {
      if (event.type === pushEventType) {
        listener(event.payload as PushServer.PushEventMap[PushEventType]);
      }
    });
  },
};
