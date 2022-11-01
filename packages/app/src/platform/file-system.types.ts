import type { IDisposable } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/lifecycle';
import type { CoordinationArgs } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import type { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import type {
  FileDeleteOptions,
  IFileService,
  IFileStat,
  IFileStatWithMetadata,
  IResolveFileOptions,
  IResolveMetadataFileOptions,
  IWatchOptions,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

export type PlatformFileSystem = {
  resolve(
    resource: UriComponents,
    options: IResolveMetadataFileOptions,
  ): Promise<IFileStatWithMetadata>;
  resolve(resource: UriComponents, options?: IResolveFileOptions): Promise<IFileStat>;
  del(
    resource: UriComponents,
    options?: Partial<Omit<FileDeleteOptions, 'useTrash'>>,
  ): Promise<void>;
  trash(
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
  onDidFilesChange: IFileService['onDidFilesChange'];
};

export type PlatformFileSystemURIInstances = {
  resolve: IFileService['resolve'];
  del(resource: URI, options?: Partial<Omit<FileDeleteOptions, 'useTrash'>>): Promise<void>;
  trash(resource: URI, options?: Partial<Omit<FileDeleteOptions, 'useTrash'>>): Promise<void>;
  copy: IFileService['copy'];
  move: IFileService['move'];
  createFolder: IFileService['createFolder'];
  watch: IFileService['watch'];
  onDidFilesChange: IFileService['onDidFilesChange'];
};
