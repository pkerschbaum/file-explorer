import type http from 'node:http';
import { Server } from 'socket.io';
import invariant from 'tiny-invariant';

import { PUSH_EVENT } from '#pkg/file-explorer-agent/constants';

declare global {
  namespace PushServer {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface -- used to allow augmentation from outside
    interface PushEventMap {}
  }
}

export type PushEvent = {
  [key in keyof PushServer.PushEventMap]: {
    type: key;
    payload: PushServer.PushEventMap[key];
  };
}[keyof PushServer.PushEventMap];

export class PushServer {
  private readonly io: Server;

  constructor(httpServer: http.Server) {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*',
      },
    });
  }

  public pushEvent = (event: PushEvent): void => {
    const [firstSocket, ...remainingSockets] = this.io.of('/').sockets.values();
    invariant(firstSocket, `expected to find one connected socket, but did not`);
    invariant(remainingSockets.length === 0);
    firstSocket.emit(PUSH_EVENT, event);
  };
}
