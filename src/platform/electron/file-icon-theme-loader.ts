import { loadCssRules } from '@app/operations/file-icon-theme.operations';
import type { PlatformFileIconThemeLoader } from '@app/platform/file-icon-theme-loader.types';

const FILE_ICON_THEME_RELATIVE_PATH = './icon-theme/';
const FILE_ICON_THEME_PATH_REPLACE_REGEX = /file:\/\/\/icon-theme\//g;

export const createFileIconThemeLoader = () => {
  const instance: PlatformFileIconThemeLoader = {
    loadCssRules: async (fileIconThemePathFragment) => {
      return await loadCssRules({
        fileIconThemeRelativePath: FILE_ICON_THEME_RELATIVE_PATH,
        fileIconThemePathFragment,
        cssRulesPostProcessing: (rawIconThemeCssRules) => {
          return rawIconThemeCssRules.replace(
            FILE_ICON_THEME_PATH_REPLACE_REGEX,
            FILE_ICON_THEME_RELATIVE_PATH,
          );
        },
      });
    },
  };

  return instance;
};
