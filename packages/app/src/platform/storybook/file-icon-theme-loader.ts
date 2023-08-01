import { path } from '@app/base/path';
import { platform } from '@app/base/platform';
import { loadCssRules } from '@app/operations/file-icon-theme.operations';
import type { PlatformFileIconThemeLoader } from '@app/platform/file-icon-theme-loader.types';

const FILE_ICON_THEME_RELATIVE_PATH = './icon-theme/';
const FILE_ICON_THEME_PATH_REPLACE_REGEX = /file:\/\/\//g;

export function createStorybookFileIconThemeLoader(): PlatformFileIconThemeLoader {
  return {
    loadCssRules: async (fileIconThemePathFragment) => {
      return await loadCssRules({
        fileIconThemeRelativePath: FILE_ICON_THEME_RELATIVE_PATH,
        fileIconThemePathFragment,
        cssRulesPostProcessing: (rawIconThemeCssRules) => {
          return rawIconThemeCssRules.replace(
            FILE_ICON_THEME_PATH_REPLACE_REGEX,
            platform.isWindows
              ? path.join(FILE_ICON_THEME_RELATIVE_PATH, fileIconThemePathFragment, '/')
              : '/',
          );
        },
      });
    },
  };
}
