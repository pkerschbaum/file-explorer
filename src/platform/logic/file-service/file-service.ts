import { DiskFileSystemProvider } from 'code-oss-file-service/out/vs/platform/files/electron-browser/diskFileSystemProvider';
import {
  ILogService,
  ConsoleMainLogger,
} from 'code-oss-file-service/out/vs/platform/log/common/log';
import { FileService } from 'code-oss-file-service/out/vs/platform/files/common/fileService';
import { Schemas } from 'code-oss-file-service/out/vs/base/common/network';

export function bootstrapModule() {
  const logger = new ConsoleMainLogger();
  const fileService = new FileService(logger as unknown as ILogService);
  const diskFileSystemProvider = new DiskFileSystemProvider(logger as unknown as ILogService);
  fileService.registerProvider(Schemas.file, diskFileSystemProvider);

  return { fileService };
}
