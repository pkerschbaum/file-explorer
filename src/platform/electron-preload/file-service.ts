import { DiskFileSystemProvider } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/electron-browser/diskFileSystemProvider';
import {
  ConsoleMainLogger,
  LogService,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';
import { FileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/fileService';
import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';

export function bootstrapModule() {
  const logger = new ConsoleMainLogger();
  const logService = new LogService(logger);
  const fileService = new FileService(logService);
  const diskFileSystemProvider = new DiskFileSystemProvider(logService);
  fileService.registerProvider(Schemas.file, diskFileSystemProvider);

  return { fileService };
}

export type PlatformFileService = ReturnType<typeof bootstrapModule>['fileService'];
