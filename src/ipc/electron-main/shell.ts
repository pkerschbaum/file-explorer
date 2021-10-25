import { ipcMain, IpcMainInvokeEvent, shell } from 'electron';

import { check } from '@app/base/utils/assert.util';
import { Awaited } from '@app/base/utils/types.util';
import {
  ShellOpenPath,
  ShellShowItemInFolder,
  SHELL_OPENPATH_CHANNEL,
  SHELL_SHOWITEMINFOLDER_CHANNEL,
} from '@app/ipc/common/shell';

export function registerListeners(): void {
  ipcMain.handle(SHELL_OPENPATH_CHANNEL, openPathHandler);
  ipcMain.handle(SHELL_SHOWITEMINFOLDER_CHANNEL, showItemInFolderHandler);
}

async function openPathHandler(
  _1: IpcMainInvokeEvent,
  { fsPath }: ShellOpenPath.Args,
): ShellOpenPath.ReturnValue {
  const errorMessage = await shell.openPath(fsPath);
  if (check.isNonEmptyString(errorMessage)) {
    throw new Error(`Could not open path, reason: ${errorMessage}`);
  }
}

function showItemInFolderHandler(
  _1: IpcMainInvokeEvent,
  { fsPath }: ShellShowItemInFolder.Args,
): Awaited<ShellShowItemInFolder.ReturnValue> {
  shell.showItemInFolder(fsPath);
}
