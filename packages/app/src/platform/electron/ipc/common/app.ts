import type { app } from 'electron';

import { config } from '@app/config';

export declare namespace IpcApp {
  namespace GetPath {
    export type Args = { name: Parameters<typeof app.getPath>[0] };
    export type ReturnValue = Promise<string>;
  }
}

export const APP_CHANNEL = {
  GET_PATH: `${config.productName}:app:getPath`,
};
