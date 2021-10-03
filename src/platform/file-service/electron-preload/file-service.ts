import { contextBridge, ipcRenderer } from 'electron';

import {
  FileServiceResolveArgs,
  FileServiceResolveReturnValue,
  FILESERVICE_RESOLVE_CHANNEL,
} from '@app/platform/file-service/common/file-service';

const fileServiceIpcRenderer = {
  resolve: (...args: FileServiceResolveArgs): FileServiceResolveReturnValue =>
    ipcRenderer.invoke(FILESERVICE_RESOLVE_CHANNEL, ...args),
};

contextBridge.exposeInMainWorld('fileService', fileServiceIpcRenderer);
