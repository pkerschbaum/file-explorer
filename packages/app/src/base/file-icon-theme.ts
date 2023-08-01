import { getIconClasses } from '@pkerschbaum/code-oss-file-icon-theme';
import * as CodeOSSURI from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import type { FileKind } from '@app/base/files';
import type { UriComponents } from '@app/base/uri';

export function loadIconClasses(
  resource: UriComponents | undefined,
  fileKind: FileKind,
): string[] | Promise<string[]> {
  return getIconClasses(
    resource === undefined ? undefined : CodeOSSURI.URI.from(resource),
    fileKind,
  );
}
