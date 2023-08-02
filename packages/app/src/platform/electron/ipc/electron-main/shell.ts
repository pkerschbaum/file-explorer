import type { IpcMainInvokeEvent } from 'electron';
import { ipcMain, shell } from 'electron';

import { check } from '#pkg/base/utils/assert.util';
import type { IpcShell } from '#pkg/platform/electron/ipc/common/shell';
import { SHELL_CHANNEL } from '#pkg/platform/electron/ipc/common/shell';

export function registerListeners(): void {
  ipcMain.handle(SHELL_CHANNEL.OPEN_PATH, openPathHandler);
  ipcMain.handle(SHELL_CHANNEL.SHOW_ITEM_IN_FOLDER, showItemInFolderHandler);
}

async function openPathHandler(
  _1: IpcMainInvokeEvent,
  { fsPath }: IpcShell.OpenPath.Args,
): IpcShell.OpenPath.ReturnValue {
  const errorMessage = await shell.openPath(fsPath);
  if (check.isNonEmptyString(errorMessage)) {
    throw new Error(`Could not open path, reason: ${errorMessage}`);
  }
}

function showItemInFolderHandler(
  _1: IpcMainInvokeEvent,
  { fsPath }: IpcShell.ShowItemInFolder.Args,
): Awaited<IpcShell.ShowItemInFolder.ReturnValue> {
  shell.showItemInFolder(fsPath);
}
