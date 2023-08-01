import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import type * as codeOSSFiles from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as codeOSSFileService from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/fileService';

import { VSBuffer, type VSBufferReadable, type VSBufferReadableStream } from '@app/base/buffer';
import type { Event } from '@app/base/event';
import type {
  FileDeleteOptions,
  IFileStat,
  IFileStatWithMetadata,
  IResolveFileOptions,
  IResolveMetadataFileOptions,
  IWatchOptions,
} from '@app/base/files';
import type { IDisposable } from '@app/base/lifecycle';
import type { CoordinationArgs } from '@app/base/resources';
import type { UriComponents } from '@app/base/uri';

export class FileService extends codeOSSFileService.FileService {
  public override createFolder(
    resource: UriComponents,
  ): Promise<codeOSSFiles.IFileStatWithMetadata> {
    return super.createFolder(codeOSSUri.URI.from(resource));
  }

  public override createFile(
    resource: UriComponents,
    bufferOrReadableOrStream:
      | VSBuffer
      | VSBufferReadable
      | VSBufferReadableStream = VSBuffer.fromString(''),
    options?: codeOSSFiles.ICreateFileOptions,
  ): Promise<codeOSSFiles.IFileStatWithMetadata> {
    return super.createFile(codeOSSUri.URI.from(resource), bufferOrReadableOrStream, options);
  }
}

export type PlatformFileService = {
  resolve(
    resource: UriComponents,
    options: IResolveMetadataFileOptions,
  ): Promise<IFileStatWithMetadata>;
  resolve(resource: UriComponents, options?: IResolveFileOptions): Promise<IFileStat>;
  del(
    resource: UriComponents,
    options?: Partial<Omit<FileDeleteOptions, 'useTrash'>>,
  ): Promise<void>;
  copy(
    source: UriComponents,
    target: UriComponents,
    overwrite?: boolean,
    coordinationArgs?: CoordinationArgs,
  ): Promise<IFileStatWithMetadata>;
  move(
    source: UriComponents,
    target: UriComponents,
    overwrite?: boolean,
    coordinationArgs?: CoordinationArgs,
  ): Promise<IFileStatWithMetadata>;
  createFolder(resource: UriComponents): Promise<IFileStatWithMetadata>;
  watch(resource: UriComponents, options?: IWatchOptions): IDisposable;
  onDidFilesChange: Event<PlatformFileChangesEvent>;
};

type PlatformFileChangesEvent = {
  affects(resource: UriComponents): boolean;
};

export function fileServiceUriInstancesToComponents(fileService: FileService): PlatformFileService {
  return {
    async resolve(resource, options) {
      const result = await fileService.resolve(uriComponentsToInstance(resource), options);
      fileStatUriInstancesToComponents(result);
      return result as unknown as any;
    },
    del(resource, options) {
      return fileService.del(uriComponentsToInstance(resource), options);
    },
    async copy(source, target, overwrite, coordinationArgs) {
      const result = await fileService.copy(
        uriComponentsToInstance(source),
        uriComponentsToInstance(target),
        overwrite,
        coordinationArgs,
      );
      fileStatUriInstancesToComponents(result);
      return result;
    },
    async move(source, target, overwrite, coordinationArgs) {
      const result = await fileService.move(
        uriComponentsToInstance(source),
        uriComponentsToInstance(target),
        overwrite,
        coordinationArgs,
      );
      fileStatUriInstancesToComponents(result);
      return result;
    },
    async createFolder(resource) {
      const result = await fileService.createFolder(uriComponentsToInstance(resource));
      fileStatUriInstancesToComponents(result);
      return result;
    },
    watch(resource, options) {
      return fileService.watch(uriComponentsToInstance(resource), options);
    },
    onDidFilesChange(listener, ...delegated) {
      return fileService.onDidFilesChange(
        (e) =>
          listener({
            affects(resource) {
              return e.affects(uriComponentsToInstance(resource));
            },
          }),
        ...delegated,
      );
    },
  };
}

function uriComponentsToInstance(uri: UriComponents) {
  return codeOSSUri.URI.from(uri);
}

function fileStatUriInstancesToComponents<T extends codeOSSFiles.IFileStat>(stat: T): void {
  (stat as { -readonly [prop in keyof IFileStat]: IFileStat[prop] }).resource =
    stat.resource.toJSON();
  if (stat.children) {
    for (const child of stat.children) {
      fileStatUriInstancesToComponents(child);
    }
  }
}
