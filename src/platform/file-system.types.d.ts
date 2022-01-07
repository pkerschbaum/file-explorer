import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

export type PlatformFileSystem = {
  resolve(
    resource: UriComponents,
    options: IResolveMetadataFileOptions,
  ): Promise<IFileStatWithMetadata>;
  resolve(resource: UriComponents, options?: IResolveFileOptions): Promise<IFileStat>;
  del(resource: UriComponents, options?: Partial<FileDeleteOptions>): Promise<void>;
  copy(
    source: UriComponents,
    target: UriComponents,
    overwrite?: boolean,
  ): Promise<IFileStatWithMetadata>;
  copy(
    source: UriComponents,
    target: UriComponents,
    overwrite?: boolean,
    additionalArgs?: { token?: CancellationToken; progressCb?: (args: ProgressCbArgs) => void },
  ): Promise<undefined | IFileStatWithMetadata>;
  move(
    source: UriComponents,
    target: UriComponents,
    overwrite?: boolean,
  ): Promise<IFileStatWithMetadata>;
  move(
    source: UriComponents,
    target: UriComponents,
    overwrite?: boolean,
    additionalArgs?: { token?: CancellationToken; progressCb?: (args: ProgressCbArgs) => void },
  ): Promise<undefined | IFileStatWithMetadata>;
  createFolder(resource: UriComponents): Promise<IFileStatWithMetadata>;
  watch(resource: UriComponents, options?: IWatchOptions): IDisposable;
  onDidFilesChange: IFileService['onDidFilesChange'];
};

export type PlatformFileSystemURIInstances = {
  resolve: IFileService['resolve'];
  del: IFileService['del'];
  copy: IFileService['copy'];
  move: IFileService['move'];
  createFolder: IFileService['createFolder'];
  watch: IFileService['watch'];
  onDidFilesChange: IFileService['onDidFilesChange'];
};
