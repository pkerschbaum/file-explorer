import * as codeOSSFileIconTheme from '@pkerschbaum/code-oss-file-icon-theme';

import type { IFileService } from '@app/base/files';
import { URI, UriComponents } from '@app/base/uri';

export function loadFileIconThemeCssRules({
  fileIconThemeUri,
  fileService,
}: {
  fileIconThemeUri: UriComponents;
  fileService: IFileService;
}): Promise<string> {
  return codeOSSFileIconTheme.loadFileIconThemeCssRules({
    // eslint-disable-next-line no-restricted-syntax -- in this file we have the "boundary" to `@pkerschbaum/code-oss-file-icon-theme`, so it is allowed to use `URI.from` here
    fileIconThemeUri: URI.from(fileIconThemeUri),
    fileService,
  });
}
