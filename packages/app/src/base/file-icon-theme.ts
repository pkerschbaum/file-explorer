import { getIconClasses } from '@pkerschbaum/code-oss-file-icon-theme';
import * as CodeOSSURI from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import type { FileKind } from '#pkg/base/files';
import type { UriComponents } from '#pkg/base/uri';

export function loadIconClasses(
  resource: UriComponents | undefined,
  fileKind: FileKind,
): string[] | Promise<string[]> {
  return getIconClasses(
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-icon-theme` here
    resource === undefined ? undefined : CodeOSSURI.URI.from(resource),
    fileKind,
  );
}
