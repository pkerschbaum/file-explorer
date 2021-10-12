import { app, ipcMain, IpcMainInvokeEvent } from 'electron';

import { GetNativeFileIconDataURL, NATIVEFILEICON_CHANNEL } from '@app/ipc/common/native-file-icon';

export function registerListeners(): void {
  ipcMain.handle(NATIVEFILEICON_CHANNEL, getNativeFileIconDataURLHandler);
}

async function getNativeFileIconDataURLHandler(
  _1: IpcMainInvokeEvent,
  { fsPath }: GetNativeFileIconDataURL.Args,
): GetNativeFileIconDataURL.ReturnValue {
  const icon = await app.getFileIcon(fsPath, { size: 'large' });
  return icon.toDataURL();
}
