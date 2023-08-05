import type http from 'node:http';
import { Server } from 'socket.io';

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
    // TODO avoid pushing to all sockets; maybe get an ID for each browser tab and send push events only to the relevant one?
    const allSockets = this.io.of('/').sockets.values();
    for (const socket of allSockets) {
      socket.emit(PUSH_EVENT, event);
    }
  };
}
