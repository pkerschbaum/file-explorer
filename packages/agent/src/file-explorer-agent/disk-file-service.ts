import { DiskFileSystemProvider } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/node/diskFileSystemProvider';
import {
  ConsoleMainLogger,
  LogService,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';

import type { IFileService } from '@file-explorer/code-oss-ecma/files';
import { FileService } from '@file-explorer/code-oss-ecma/fileService';
import { network } from '@file-explorer/code-oss-ecma/network';

export function bootstrapDiskFileService() {
  const logger = new ConsoleMainLogger();
  const logService = new LogService(logger);
  const fileService: IFileService = new FileService(logService);
  const diskFileSystemProvider = new DiskFileSystemProvider(logService);
  fileService.registerProvider(network.Schemas.file, diskFileSystemProvider);

  return fileService;
}
