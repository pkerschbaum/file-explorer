import { config } from '@app/config';

export declare namespace IpcApp {
  namespace GetNativeFileIconDataURL {
    export type Args = { fsPath: string };
    export type ReturnValue = Promise<string | undefined>;
  }
}

export const APP_CHANNEL = {
  NATIVE_FILE_ICON: `${config.productName}:app:getNativeFileIconDataURL`,
};
