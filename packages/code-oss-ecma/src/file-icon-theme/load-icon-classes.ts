import { getIconClasses } from '@pkerschbaum/code-oss-file-icon-theme';
import * as codeOSSURI from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import type { FileKind } from '#pkg/files';
import type { UriComponents } from '#pkg/uri';

export function loadIconClasses(
  resource: UriComponents | undefined,
  fileKind: FileKind,
): string[] | Promise<string[]> {
  return getIconClasses(
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-icon-theme` here
    resource === undefined ? undefined : codeOSSURI.URI.from(resource),
    fileKind,
  );
}
