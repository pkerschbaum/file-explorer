import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { ipcMain, IpcMainInvokeEvent } from 'electron';

import { bootstrapDiskFileService } from '@app/platform/electron/electron-preload/bootstrap-disk-file-service';
import {
  IpcFileService,
  FILE_SERVICE_CHANNEL,
} from '@app/platform/electron/ipc/common/file-service';

const mainProcessFileService = bootstrapDiskFileService();

export function registerListeners(): void {
  ipcMain.handle(FILE_SERVICE_CHANNEL.DELETE_RECURSIVE, deleteRecursiveHandler);
}

async function deleteRecursiveHandler(
  _1: IpcMainInvokeEvent,
  { uri }: IpcFileService.DeleteRecursive.Args,
): IpcFileService.DeleteRecursive.ReturnValue {
  return await mainProcessFileService.del(URI.from(uri), { recursive: true });
}
