import { config } from '@app/config';

export declare namespace IpcWindow {
  namespace Minimize {
    export type Args = void;
    export type ReturnValue = Promise<void>;
  }
  namespace ToggleMaximize {
    export type Args = void;
    export type ReturnValue = Promise<void>;
  }
  namespace Close {
    export type Args = void;
    export type ReturnValue = Promise<void>;
  }
}

export const WINDOW_CHANNEL = {
  MINIMIZE: `${config.productName}:window:minimize`,
  TOGGLE_MAXIMIZE: `${config.productName}:window:toggleMaximize`,
  CLOSE: `${config.productName}:window:close`,
};
