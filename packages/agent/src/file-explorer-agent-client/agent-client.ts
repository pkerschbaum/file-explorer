import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { io } from 'socket.io-client';
import superjson from 'superjson';

import { AGENT_PORT, PUSH_EVENT, TRPC_SERVER_BASE_PATH } from '#pkg/constants';
import type { AppRouter } from '#pkg/file-explorer-agent/initialize-file-explorer-agent';
import type { PushEvent } from '#pkg/file-explorer-agent/push-server';

export { blob } from '#pkg/file-explorer-agent-client/blob';

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: `http://localhost:${AGENT_PORT}${TRPC_SERVER_BASE_PATH}`,
    }),
  ],
});
const ioSocket = io(`http://localhost:${AGENT_PORT}`);
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
