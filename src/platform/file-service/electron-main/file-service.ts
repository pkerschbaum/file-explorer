import { ipcMain } from 'electron';
import { DiskFileSystemProvider } from 'code-oss-file-service/out/vs/platform/files/node/diskFileSystemProvider';
import {
  ILogService,
  ConsoleMainLogger,
} from 'code-oss-file-service/out/vs/platform/log/common/log';
import { IFileStat } from 'code-oss-file-service/out/vs/platform/files/common/files';
import { FileService } from 'code-oss-file-service/out/vs/platform/files/common/fileService';
import { Schemas } from 'code-oss-file-service/out/vs/base/common/network';
import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import { FileServiceResolveArgs, FILESERVICE_RESOLVE_CHANNEL } from '../common/file-service';

const logger = new ConsoleMainLogger();
const fileService = new FileService(logger as unknown as ILogService);
const diskFileSystemProvider = new DiskFileSystemProvider(logger as unknown as ILogService);
fileService.registerProvider(Schemas.file, diskFileSystemProvider);

ipcMain.handle(FILESERVICE_RESOLVE_CHANNEL, async (_, ...args: FileServiceResolveArgs) => {
  const result = await fileService.resolve(URI.from(args[0]));
  return createUriInstancesRecursive(result);
});

function createUriInstancesRecursive(original: IFileStat): IFileStat {
  return {
    ...original,
    resource: URI.from(original.resource),
    children: original.children?.map((child) => createUriInstancesRecursive(child)),
  };
}
