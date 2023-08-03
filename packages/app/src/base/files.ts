import * as codeOSSFiles from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { z } from 'zod';

import { UriComponents } from '#pkg/base/uri';

export type IFileStat = Omit<codeOSSFiles.IFileStat, 'resource' | 'children'> & {
  readonly resource: UriComponents;
  readonly children?: IFileStat[];
};

/**
 * {@link codeOSSFiles.IResolveFileOptions}
 */
export const IResolveFileOptions = z.object({
  resolveTo: z.array(UriComponents).optional(),
  resolveSingleChildDescendants: z.boolean().optional(),
  resolveMetadata: z.boolean().optional(),
});
export type IResolveFileOptions = z.infer<typeof IResolveFileOptions>;
/**
 * {@link codeOSSFiles.IResolveMetadataFileOptions}
 */
export const IResolveMetadataFileOptions = IResolveFileOptions.extend({
  resolveMetadata: z.literal(true),
});
export type IResolveMetadataFileOptions = z.infer<typeof IResolveMetadataFileOptions>;
/**
 * {@link codeOSSFiles.FileDeleteOptions}
 */
export const FileDeleteOptionsWithoutTrash = z.object({
  recursive: z.boolean(),
});
export type FileDeleteOptionsWithoutTrash = z.infer<typeof FileDeleteOptionsWithoutTrash>;
/**
 * {@link codeOSSFiles.IWatchOptions}
 */
export const IWatchOptions = z.object({
  recursive: z.boolean(),
  excludes: z.array(z.string()),
});
export type IWatchOptions = z.infer<typeof IWatchOptions>;

export type IFileStatWithMetadata = Omit<
  codeOSSFiles.IFileStatWithMetadata,
  'resource' | 'children'
> & {
  readonly resource: UriComponents;
  readonly children?: IFileStatWithMetadata[];
};

export type IFileService = codeOSSFiles.IFileService;
export type IFileContent = codeOSSFiles.IFileContent;
export const FileKind = codeOSSFiles.FileKind;
export type FileKind = codeOSSFiles.FileKind;
export type IStat = codeOSSFiles.IStat;
export type ICreateFileOptions = codeOSSFiles.ICreateFileOptions;
