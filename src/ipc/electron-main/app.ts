import { app, ipcMain, IpcMainInvokeEvent } from 'electron';

import { IpcApp, APP_CHANNEL } from '@app/ipc/common/app';

export function registerListeners(): void {
  ipcMain.handle(APP_CHANNEL.NATIVE_FILE_ICON, getNativeFileIconDataURLHandler);
}

async function getNativeFileIconDataURLHandler(
  _1: IpcMainInvokeEvent,
  { fsPath }: IpcApp.GetNativeFileIconDataURL.Args,
): IpcApp.GetNativeFileIconDataURL.ReturnValue {
  const icon = await app.getFileIcon(fsPath, { size: 'large' });
  return icon.toDataURL();
}
