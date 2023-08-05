import * as codeOSSUri from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import type * as codeOSSFiles from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import * as codeOSSFileService from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/fileService';

import type { VSBuffer, VSBufferReadable, VSBufferReadableStream } from '#pkg/buffer';
import type { Event } from '#pkg/event';
import type {
  FileDeleteOptionsWithoutTrash,
  ICreateFileOptions,
  IFileService,
  IFileStat,
  IFileStatWithMetadata,
  IResolveFileOptions,
  IResolveMetadataFileOptions,
  IWatchOptions,
} from '#pkg/files';
import type { IDisposable } from '#pkg/lifecycle';
import type { CoordinationArgs } from '#pkg/resources';
import type { UriComponents } from '#pkg/uri';

export const FileService = codeOSSFileService.FileService;
export type FileService = codeOSSFileService.FileService;

export type IFileServiceUriComponents = {
  resolve(
    resource: UriComponents,
    options: IResolveMetadataFileOptions,
  ): Promise<IFileStatWithMetadata>;
  resolve(resource: UriComponents, options?: IResolveFileOptions): Promise<IFileStat>;
  del(resource: UriComponents, options?: Parameters<FileService['del']>[1]): Promise<void>;
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
  createFile(
    resource: UriComponents,
    bufferOrReadableOrStream: VSBuffer | VSBufferReadable | VSBufferReadableStream,
    options?: ICreateFileOptions,
  ): Promise<IFileStatWithMetadata>;
  watch(resource: UriComponents, options?: IWatchOptions): IDisposable;
  onDidFilesChange: Event<PlatformFileChangesEvent>;
};

type PlatformFileChangesEvent = {
  affects(resource: UriComponents): boolean;
};

export type PlatformFileService = {
  resolve(
    resource: UriComponents,
    options: IResolveMetadataFileOptions,
  ): Promise<IFileStatWithMetadata>;
  resolve(resource: UriComponents, options?: IResolveFileOptions): Promise<IFileStat>;
  del(resource: UriComponents, options?: FileDeleteOptionsWithoutTrash): Promise<void>;
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
  watch(resource: UriComponents, options?: IWatchOptions): IDisposable | Promise<IDisposable>;
  onResourceChanged(
    resource: UriComponents,
    onChange: () => void,
  ): IDisposable | Promise<IDisposable>;
};

export function fileServiceUriInstancesToComponents(
  fileService: IFileService,
): IFileServiceUriComponents {
  return {
    async resolve(resource, options) {
      const result = await fileService.resolve(uriComponentsToInstance(resource), {
        ...options,
        resolveTo: options?.resolveTo?.map(uriComponentsToInstance),
      });
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
    async createFile(resource, bufferOrReadableOrStream, options) {
      const result = await fileService.createFile(
        uriComponentsToInstance(resource),
        bufferOrReadableOrStream,
        options,
      );
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
  // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-service` here
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
