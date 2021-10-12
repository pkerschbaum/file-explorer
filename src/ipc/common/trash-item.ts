import { shell } from 'electron';

export declare namespace TrashItem {
  export type Args = Parameters<typeof shell.trashItem>;
  export type ReturnValue = ReturnType<typeof shell.trashItem>;
}
export const TRASHITEM_CHANNEL = 'app:trashItem';
