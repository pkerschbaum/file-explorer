import { app, ipcMain, IpcMainInvokeEvent } from 'electron';

import { IpcApp, APP_CHANNEL } from '@app/platform/electron/ipc/common/app';

export function registerListeners(): void {
  ipcMain.handle(APP_CHANNEL.GET_PATH, getPathHandler);
}

function getPathHandler(
  _1: IpcMainInvokeEvent,
  { name }: IpcApp.GetPath.Args,
): Awaited<IpcApp.GetPath.ReturnValue> {
  return app.getPath(name);
}
