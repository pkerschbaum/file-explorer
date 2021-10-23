import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileKind } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import {
  registerLanguagesOfExtensions,
  loadFileIconTheme,
} from '@pkerschbaum/code-oss-file-icon-theme';

import {
  EXTENSIONS_DIRECTORY_URI,
  FILE_ICON_THEME_RELATIVE_PATH,
  FILE_ICON_THEME_URI,
} from '@app/static-resources-renderer';

export type PlatformFileIconTheme = {
  loadCssRules: () => string | Promise<string>;
  loadIconClasses: (resource: URI, fileKind: FileKind) => string[] | Promise<string[]>;
};

export const FILE_ICON_THEME_PATH_REPLACE_REGEX = /vscode-file:.+\/static\/icon-theme\//g;

export async function bootstrapModule(): Promise<PlatformFileIconTheme> {
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

  const result: PlatformFileIconTheme = {
    loadCssRules: () => cssRules,
    loadIconClasses: iconTheme.getIconClasses,
  };

  return result;
}
