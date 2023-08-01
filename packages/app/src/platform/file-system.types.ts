import type { FileDeleteOptions } from '#pkg/base/files';
import type { PlatformFileService } from '#pkg/base/fileService';
import type { UriComponents } from '#pkg/base/uri';

export type PlatformFileSystem = PlatformFileService & {
  trash(
    resource: UriComponents,
    options?: Partial<Omit<FileDeleteOptions, 'useTrash'>>,
  ): Promise<void>;
};
