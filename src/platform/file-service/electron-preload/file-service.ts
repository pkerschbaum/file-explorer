import { contextBridge, ipcRenderer } from 'electron';
import { VSBuffer } from 'code-oss-file-service/out/vs/base/common/buffer';
import { IFileStat } from 'code-oss-file-service/out/vs/platform/files/common/files';
import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import {
  FileServiceIPC,
  FILESERVICE_READFILE_CHANNEL,
  FILESERVICE_RESOLVE_CHANNEL,
} from '@app/platform/file-service/common/file-service';

export const fileServiceIpcRenderer = {
  resolve: async (...args: FileServiceIPC.Resolve.Args): FileServiceIPC.Resolve.ReturnValue => {
    const result = await ipcRenderer.invoke(FILESERVICE_RESOLVE_CHANNEL, ...args);
    return createUriInstancesRecursive(result);
  },
  readFile: async (...args: FileServiceIPC.ReadFile.Args): FileServiceIPC.ReadFile.ReturnValue => {
    const result = await ipcRenderer.invoke(FILESERVICE_READFILE_CHANNEL, ...args);
    return {
      ...result,
      resource: URI.from(result.resource),
      value: VSBuffer.wrap(result.value),
    };
  },
};

contextBridge.exposeInMainWorld('fileService', fileServiceIpcRenderer);

function createUriInstancesRecursive(original: IFileStat): IFileStat {
  return {
    ...original,
    resource: URI.from(original.resource),
    children: original.children?.map((child) => createUriInstancesRecursive(child)),
  };
}
