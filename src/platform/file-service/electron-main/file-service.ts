import { ipcMain } from 'electron';
import { DiskFileSystemProvider } from 'code-oss-file-service/out/vs/platform/files/node/diskFileSystemProvider';
import {
  ILogService,
  ConsoleMainLogger,
} from 'code-oss-file-service/out/vs/platform/log/common/log';
import { FileService } from 'code-oss-file-service/out/vs/platform/files/common/fileService';
import { Schemas } from 'code-oss-file-service/out/vs/base/common/network';
import { URI } from 'code-oss-file-service/out/vs/base/common/uri';

import {
  FileServiceIPC,
  FILESERVICE_READFILE_CHANNEL,
  FILESERVICE_RESOLVE_CHANNEL,
} from '@app/platform/file-service/common/file-service';

const logger = new ConsoleMainLogger();
export const fileService = new FileService(logger as unknown as ILogService);
const diskFileSystemProvider = new DiskFileSystemProvider(logger as unknown as ILogService);
fileService.registerProvider(Schemas.file, diskFileSystemProvider);

async function handleResolve(
  _1: unknown,
  ...args: FileServiceIPC.Resolve.Args
): FileServiceIPC.Resolve.ReturnValue {
  const [uri, ...otherArgs] = args;
  return await fileService.resolve(URI.from(uri), ...otherArgs);
}

async function handleReadFile(
  _1: unknown,
  ...args: FileServiceIPC.ReadFile.Args
): FileServiceIPC.ReadFile.ReturnValue {
  const [uri, ...otherArgs] = args;
  return await fileService.readFile(URI.from(uri), ...otherArgs);
}

ipcMain.handle(FILESERVICE_RESOLVE_CHANNEL, handleResolve);
ipcMain.handle(FILESERVICE_READFILE_CHANNEL, handleReadFile);
