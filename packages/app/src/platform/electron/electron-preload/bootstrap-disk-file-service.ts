import { DiskFileSystemProvider } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/node/diskFileSystemProvider';
import {
  ConsoleMainLogger,
  LogService,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';

import { FileService } from '@app/base/fileService';
import { network } from '@app/base/network';

export function bootstrapDiskFileService() {
  const logger = new ConsoleMainLogger();
  const logService = new LogService(logger);
  const fileService = new FileService(logService);
  const diskFileSystemProvider = new DiskFileSystemProvider(logService);
  fileService.registerProvider(network.Schemas.file, diskFileSystemProvider);

  return fileService;
}
