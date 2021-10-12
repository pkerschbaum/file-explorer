import { ipcMain, IpcMainInvokeEvent, shell } from 'electron';

import { TrashItem, TRASHITEM_CHANNEL } from '@app/ipc/common/trash-item';

export function registerListeners(): void {
  ipcMain.handle(TRASHITEM_CHANNEL, trashItemHandler);
}

function trashItemHandler(_1: IpcMainInvokeEvent, ...args: TrashItem.Args): TrashItem.ReturnValue {
  return shell.trashItem(...args);
}
