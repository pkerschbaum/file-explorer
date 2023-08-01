import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import type {
  ICreateFileOptions,
  IFileStatWithMetadata,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as codeOSSFileService from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/fileService';

import { VSBuffer, type VSBufferReadable, type VSBufferReadableStream } from '@app/base/buffer';
import type { UriComponents } from '@app/base/uri';

export class FileService extends codeOSSFileService.FileService {
  public override createFolder(resource: UriComponents): Promise<IFileStatWithMetadata> {
    return super.createFolder(codeOSSUri.URI.from(resource));
  }

  public override createFile(
    resource: UriComponents,
    bufferOrReadableOrStream:
      | VSBuffer
      | VSBufferReadable
      | VSBufferReadableStream = VSBuffer.fromString(''),
    options?: ICreateFileOptions,
  ): Promise<IFileStatWithMetadata> {
    return super.createFile(codeOSSUri.URI.from(resource), bufferOrReadableOrStream, options);
  }
}
