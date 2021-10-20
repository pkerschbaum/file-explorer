import {
  registerLanguagesOfExtensions,
  loadFileIconTheme,
} from '@pkerschbaum/code-oss-file-icon-theme';

import {
  EXTENSIONS_DIRECTORY_URI,
  FILE_ICON_THEME_PATH_REPLACE_REGEX,
  FILE_ICON_THEME_RELATIVE_PATH,
  FILE_ICON_THEME_URI,
} from '@app/static-resources';
import { Awaited } from '@app/base/utils/types.util';

export async function bootstrapModule() {
  await registerLanguagesOfExtensions(EXTENSIONS_DIRECTORY_URI);
  const iconTheme = await loadFileIconTheme(FILE_ICON_THEME_URI);

  /**
   * The icon-theme logic of the code-oss project constructs URLs in the CSS which use the special resource scheme "vscode-file:".
   * But we want to just use a relative path so that it works with this electron-forge setup.
   * That's why we replace all occurences of such URLs by relative paths.
   */
  const cssRules = iconTheme.iconThemeCssRules.replace(
    FILE_ICON_THEME_PATH_REPLACE_REGEX,
    FILE_ICON_THEME_RELATIVE_PATH,
  );

  const result = {
    ...iconTheme,
    iconThemeCssRules: cssRules,
  };

  return result;
}

export type PlatformFileIconTheme = Awaited<ReturnType<typeof bootstrapModule>>;
