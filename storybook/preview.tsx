import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { Parameters } from '@storybook/react';

import { fileSystemRef, nativeHostRef, persistentStorageRef } from '@app/operations/global-modules';
import { loadCssRules } from '@app/platform/file-icon-theme';
import { createFakeFileSystem } from '@app/platform/file-system.fake';
import { createFakeNativeHost } from '@app/platform/native-host.fake';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';
import { FILE_ICON_THEME_PATH_FRAGMENT } from '@app/static-resources-renderer';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const FILE_ICON_THEME_RELATIVE_PATH = './icon-theme/';
const FILE_ICON_THEME_PATH_REPLACE_REGEX = /file:\/\/\//g;

export const loaders = [
  async () => {
    fileSystemRef.current = await createFakeFileSystem();
    nativeHostRef.current = createFakeNativeHost();
    persistentStorageRef.current = createFakePersistentStorage();
  },
  async () => {
    const iconThemeCssRules = await loadCssRules({
      fileIconThemeRelativePath: FILE_ICON_THEME_RELATIVE_PATH,
      fileIconThemePathFragment: FILE_ICON_THEME_PATH_FRAGMENT,
      cssRulesPostProcessing: (rawIconThemeCssRules, fileIconThemePathFragment) =>
        rawIconThemeCssRules.replace(
          FILE_ICON_THEME_PATH_REPLACE_REGEX,
          path.join(FILE_ICON_THEME_RELATIVE_PATH, fileIconThemePathFragment, '/'),
        ),
    });
    addIconThemeCssRulesToHead(iconThemeCssRules);
  },
];
