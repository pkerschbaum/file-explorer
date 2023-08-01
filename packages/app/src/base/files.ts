import * as codeOSSFiles from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import type { UriComponents } from '#pkg/base/uri';

export type IFileStat = Omit<codeOSSFiles.IFileStat, 'resource' | 'children'> & {
  readonly resource: UriComponents;
  readonly children?: IFileStat[];
};

export type IFileStatWithMetadata = Omit<
  codeOSSFiles.IFileStatWithMetadata,
  'resource' | 'children'
> & {
  readonly resource: UriComponents;
  readonly children?: IFileStatWithMetadata[];
};

export type IFileService = codeOSSFiles.IFileService;
export type IResolveFileOptions = codeOSSFiles.IResolveFileOptions;
export type IResolveMetadataFileOptions = codeOSSFiles.IResolveMetadataFileOptions;
export type IWatchOptions = codeOSSFiles.IWatchOptions;
export type FileDeleteOptions = codeOSSFiles.FileDeleteOptions;
export type IFileContent = codeOSSFiles.IFileContent;
export const FileKind = codeOSSFiles.FileKind;
export type FileKind = codeOSSFiles.FileKind;
export type IStat = codeOSSFiles.IStat;
