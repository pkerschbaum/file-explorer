import type { IpcMainInvokeEvent } from 'electron';
import { app, ipcMain } from 'electron';

import type { IpcApp } from '#pkg/platform/electron/ipc/common/app';
import { APP_CHANNEL } from '#pkg/platform/electron/ipc/common/app';

export function registerListeners(): void {
  ipcMain.handle(APP_CHANNEL.GET_PATH, getPathHandler);
}

function getPathHandler(
  _1: IpcMainInvokeEvent,
  { name }: IpcApp.GetPath.Args,
): Awaited<IpcApp.GetPath.ReturnValue> {
  return app.getPath(name);
}
