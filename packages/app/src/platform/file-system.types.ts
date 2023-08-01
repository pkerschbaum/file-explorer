import type { FileDeleteOptions } from '@app/base/files';
import type { PlatformFileService } from '@app/base/fileService';
import type { UriComponents } from '@app/base/uri';

export type PlatformFileSystem = PlatformFileService & {
  trash(
    resource: UriComponents,
    options?: Partial<Omit<FileDeleteOptions, 'useTrash'>>,
  ): Promise<void>;
};
