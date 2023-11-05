import type { FileDeleteOptionsWithoutTrash } from '@file-explorer/code-oss-ecma/files';
import type { PlatformFileService } from '@file-explorer/code-oss-ecma/fileService';
import type { UriComponents } from '@file-explorer/code-oss-ecma/uri';

export type PlatformFileSystem = PlatformFileService & {
  trash: (resource: UriComponents, options?: FileDeleteOptionsWithoutTrash) => Promise<void>;
};
