import { DecoratorFn } from '@storybook/react';

import { createStoreInstance } from '@app/global-state/store';
import { fakeClipboard } from '@app/platform/clipboard.fake';
import { httpFileIconTheme } from '@app/platform/file-icon-theme.fake';
import { fakeFileSystem } from '@app/platform/file-system.fake';
import { fakeNativeHost } from '@app/platform/native-host.fake';
import { createFakePersistentStorage } from '@app/platform/persistent-storage.fake';
import {
  storeRef,
  dispatchRef,
  queryClientRef,
  clipboardRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
  fileIconThemeRef,
} from '@app/operations/global-modules';
import { addIconThemeCssRulesToHead } from '@app/ui/file-icon-theme';
import { Globals, queryClient } from '@app/ui/Globals';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const loaders = [
  () => {
    queryClientRef.current = queryClient;

    clipboardRef.current = fakeClipboard;
    fileIconThemeRef.current = httpFileIconTheme;
    fileSystemRef.current = fakeFileSystem;
    nativeHostRef.current = fakeNativeHost;
    const fakePersistentStorage = createFakePersistentStorage();
    persistentStorageRef.current = fakePersistentStorage;
  },
  async () => {
    const iconThemeCssRules = await fileIconThemeRef.current.loadCssRules();
    addIconThemeCssRulesToHead(iconThemeCssRules);
  },
];

export const decorators: DecoratorFn[] = [
  (story) => {
    const store = createStoreInstance();
    storeRef.current = store;
    dispatchRef.current = store.dispatch;

    return <Globals store={store}>{story()}</Globals>;
  },
];
