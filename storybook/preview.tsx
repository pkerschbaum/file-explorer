import * as path from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { DecoratorFn, Parameters } from '@storybook/react';

import { createStoreInstance } from '@app/global-state/store';
import {
  storeRef,
  dispatchRef,
  queryClientRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
} from '@app/operations/global-modules';
import { loadCssRules } from '@app/platform/file-icon-theme';
import { fakeFileSystem } from '@app/platform/file-system.fake';
import { createFakeNativeHost } from '@app/platform/native-host.fake';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';
import { FILE_ICON_THEME_RELATIVE_PATH } from '@app/static-resources-renderer';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';
import { Globals, createQueryClient } from '@app/ui/Globals';

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const FILE_ICON_THEME_PATH_FRAGMENT = 'vscode-icons-team.vscode-icons-11.6.0';
const FILE_ICON_THEME_PATH_REPLACE_REGEX = /file:\/\/\//g;

export const loaders = [
  () => {
    fileSystemRef.current = fakeFileSystem;
    nativeHostRef.current = createFakeNativeHost();
    const fakePersistentStorage = createFakePersistentStorage();
    persistentStorageRef.current = fakePersistentStorage;
  },
  async () => {
    const iconThemeCssRules = await loadCssRules({
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

export const decorators: DecoratorFn[] = [
  (story) => {
    const queryClient = createQueryClient();
    queryClientRef.current = queryClient;
    const store = createStoreInstance();
    storeRef.current = store;
    dispatchRef.current = store.dispatch;

    return (
      <Globals queryClient={queryClient} store={store}>
        {story()}
      </Globals>
    );
  },
];
