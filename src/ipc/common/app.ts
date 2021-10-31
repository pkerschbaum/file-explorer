import { app } from 'electron';

import { config } from '@app/config';

export declare namespace IpcApp {
  namespace GetNativeFileIconDataURL {
    export type Args = { fsPath: string };
    export type ReturnValue = Promise<string | undefined>;
  }
  namespace GetPath {
    export type Args = { name: Parameters<typeof app.getPath>[0] };
    export type ReturnValue = Promise<string>;
  }
}

export const APP_CHANNEL = {
  NATIVE_FILE_ICON: `${config.productName}:app:getNativeFileIconDataURL`,
  GET_PATH: `${config.productName}:app:getPath`,
};
