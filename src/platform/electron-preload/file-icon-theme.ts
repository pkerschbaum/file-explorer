import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import {
  getIconClasses,
  loadFileIconThemeCssRules,
  registerLanguagesOfExtensions,
} from '@pkerschbaum/code-oss-file-icon-theme';

import {
  EXTENSIONS_DIRECTORY_URI,
  FILE_ICON_THEME_RELATIVE_PATH,
  FILE_ICON_THEME_BASE_URI,
} from '@app/static-resources-renderer';
import type { PlatformFileIconTheme } from '@app/platform/file-icon-theme';

export const FILE_ICON_THEME_PATH_REPLACE_REGEX = /vscode-file:.+\/static\/icon-theme\//g;

export async function bootstrapModule(): Promise<PlatformFileIconTheme> {
  await registerLanguagesOfExtensions(EXTENSIONS_DIRECTORY_URI);

  const result: PlatformFileIconTheme = {
    loadCssRules: async (fileIconThemePathFragment) => {
      const iconThemeCssRules = await loadFileIconThemeCssRules(
        URI.joinPath(FILE_ICON_THEME_BASE_URI, fileIconThemePathFragment),
      );

      /**
       * The icon-theme logic of the code-oss project constructs URLs in the CSS which use the special resource scheme "vscode-file:".
       * But we want to just use a relative path so that it works with this electron-forge setup.
       * That's why we replace all occurences of such URLs by relative paths.
       */
      const cssRules = iconThemeCssRules.replace(
        FILE_ICON_THEME_PATH_REPLACE_REGEX,
        FILE_ICON_THEME_RELATIVE_PATH,
      );

      return cssRules;
    },
    loadIconClasses: getIconClasses,
  };

  return result;
}
