import { DecoratorFn, Parameters } from '@storybook/react';

import { createStoreInstance } from '@app/global-state/store';
import {
  storeRef,
  dispatchRef,
  queryClientRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
  fileIconThemeRef,
} from '@app/operations/global-modules';
import { httpFileIconTheme } from '@app/platform/file-icon-theme.fake';
import { fakeFileSystem } from '@app/platform/file-system.fake';
import { createFakeNativeHost } from '@app/platform/native-host.fake';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';
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

export const loaders = [
  () => {
    fileIconThemeRef.current = httpFileIconTheme;
    fileSystemRef.current = fakeFileSystem;
    nativeHostRef.current = createFakeNativeHost();
    const fakePersistentStorage = createFakePersistentStorage();
    persistentStorageRef.current = fakePersistentStorage;
  },
  async () => {
    const iconThemeCssRules = await fileIconThemeRef.current.loadCssRules(
      FILE_ICON_THEME_PATH_FRAGMENT,
    );
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
