import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { FileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/fileService';
import { DiskFileSystemProvider } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/node/diskFileSystemProvider';
import {
  ConsoleMainLogger,
  LogService,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';

export function bootstrapDiskFileService() {
  const logger = new ConsoleMainLogger();
  const logService = new LogService(logger);
  const fileService = new FileService(logService);
  const diskFileSystemProvider = new DiskFileSystemProvider(logService);
  fileService.registerProvider(Schemas.file, diskFileSystemProvider);

  return fileService;
}
