import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as codeOSSInMemoryFileSystemProvider from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/inMemoryFilesystemProvider';
import * as codeOSSLog from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';

import type { IFileService, IStat } from '#pkg/base/files';
import { FileService } from '#pkg/base/fileService';
import { network } from '#pkg/base/network';
import type { UriComponents } from '#pkg/base/uri';

class InMemoryFileSystemProvider extends codeOSSInMemoryFileSystemProvider.InMemoryFileSystemProvider {
  public override stat(resource: UriComponents): Promise<IStat> {
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
    return super.stat(codeOSSUri.URI.from(resource));
  }
}

export function bootstrapInMemoryFileService() {
  const logger = new codeOSSLog.ConsoleMainLogger();
  const logService = new codeOSSLog.LogService(logger);
  const fileService: IFileService = new FileService(logService);
  const inMemoryFileSystemProvider = new InMemoryFileSystemProvider();
  fileService.registerProvider(network.Schemas.file, inMemoryFileSystemProvider);

  return { fileService, inMemoryFileSystemProvider };
}
