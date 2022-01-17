import { ipcMain, IpcMainEvent, Item } from 'electron';
import invariant from 'tiny-invariant';

import {
  IpcFileDragStart,
  FILEDRAGSTART_CHANNEL,
} from '@app/platform/electron/ipc/common/file-drag-start';
import { OUTLINE_INSERT_DRIVE_FILE_ICON_PATH } from '@app/static-resources-main';

export function registerListeners(): void {
  ipcMain.on(FILEDRAGSTART_CHANNEL, fileDragStartHandler);
}

function fileDragStartHandler(
  e: IpcMainEvent,
  { fsPaths }: IpcFileDragStart.Args,
): IpcFileDragStart.ReturnValue {
  invariant(fsPaths.length > 0);
  const startDragArg: Omit<Item, 'file'> = {
    files: fsPaths,
    icon: OUTLINE_INSERT_DRIVE_FILE_ICON_PATH,
  };
  // @ts-expect-error -- electron typings have the property "file" defined as required, although that is actually not necessary (https://www.electronjs.org/docs/latest/api/web-contents#contentsstartdragitem)
  e.sender.startDrag(startDragArg);
}
