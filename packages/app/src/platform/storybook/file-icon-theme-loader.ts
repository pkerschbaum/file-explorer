import { path } from '#pkg/base/path';
import { platform } from '#pkg/base/platform';
import { loadCssRules } from '#pkg/operations/file-icon-theme.operations';
import type { PlatformFileIconThemeLoader } from '#pkg/platform/file-icon-theme-loader.types';

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
