export declare namespace ShellOpenPath {
  export type Args = { fsPath: string };
  export type ReturnValue = Promise<void>;
}
export const SHELL_OPENPATH_CHANNEL = 'app:shellOpenPath';

export declare namespace ShellShowItemInFolder {
  export type Args = { fsPath: string };
  export type ReturnValue = Promise<void>;
}
export const SHELL_SHOWITEMINFOLDER_CHANNEL = 'app:showItemInFolder';
