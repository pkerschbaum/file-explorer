import type { FileDeleteOptions } from '@app/base/files';
import type { UriComponents } from '@app/base/uri';
import type { PlatformFileService } from '@app/platform/electron/electron-preload/initialize-privileged-platform-modules';

export type PlatformFileSystem = PlatformFileService & {
  trash(
    resource: UriComponents,
    options?: Partial<Omit<FileDeleteOptions, 'useTrash'>>,
  ): Promise<void>;
};
