import { ipcMain, IpcMainEvent } from 'electron';

import { IpcFileDragStart, FILEDRAGSTART_CHANNEL } from '@app/ipc/common/file-drag-start';
import { OUTLINE_INSERT_DRIVE_FILE_ICON_PATH } from '@app/static-resources-main';

export function registerListeners(): void {
  ipcMain.on(FILEDRAGSTART_CHANNEL, fileDragStartHandler);
}

function fileDragStartHandler(
  e: IpcMainEvent,
  { fsPath }: IpcFileDragStart.Args,
): IpcFileDragStart.ReturnValue {
  e.sender.startDrag({
    file: fsPath,
    icon: OUTLINE_INSERT_DRIVE_FILE_ICON_PATH,
  });
}
