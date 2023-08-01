import { config } from '#pkg/config';

export declare namespace IpcShell {
  namespace OpenPath {
    export type Args = { fsPath: string };
    export type ReturnValue = Promise<void>;
  }
  namespace ShowItemInFolder {
    export type Args = { fsPath: string };
    export type ReturnValue = Promise<void>;
  }
  namespace TrashItem {
    export type Args = { fsPath: string };
    export type ReturnValue = Promise<void>;
  }
}

export const SHELL_CHANNEL = {
  OPEN_PATH: `${config.productName}:shell:openPath`,
  SHOW_ITEM_IN_FOLDER: `${config.productName}:shell:showItemInFolder`,
  TRASH_ITEM: `${config.productName}:shell:trashItem`,
};
