import * as codeOSSFileIconTheme from '@pkerschbaum/code-oss-file-icon-theme';

import type { IFileService } from '#pkg/base/files';
import { URI, UriComponents } from '#pkg/base/uri';

export function loadFileIconThemeCssRules({
  fileIconThemeUri,
  fileService,
}: {
  fileIconThemeUri: UriComponents;
  fileService: IFileService;
}): Promise<string> {
  return codeOSSFileIconTheme.loadFileIconThemeCssRules({
    // eslint-disable-next-line no-restricted-syntax -- boundary to `@pkerschbaum/code-oss-file-icon-theme` here
    fileIconThemeUri: URI.from(fileIconThemeUri),
    fileService,
  });
}
