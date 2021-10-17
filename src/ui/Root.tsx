import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Providers, queryClient } from '@app/ui/Providers';
import { Shell } from '@app/ui/Shell';
import {
  clipboardRef,
  dispatchRef,
  fileIconThemeRef,
  fileSystemRef,
  nativeHostRef,
  queryClientRef,
  storeRef,
} from '@app/operations/global-modules';
import { createStoreInstance } from '@app/global-state/store';
import { StorageState } from '@app/global-state/slices/persisted.slice';
import { PlatformClipboard } from '@app/platform/clipboard';
import { PlatformFileIconTheme } from '@app/platform/file-icon-theme';
import { PlatformFileSystem } from '@app/platform/file-system';
import { PlatformNativeHost } from '@app/platform/native-host';

export type AppDependencies = {
  clipboard: PlatformClipboard;
  fileIconTheme: PlatformFileIconTheme;
  fileSystem: PlatformFileSystem;
  nativeHost: PlatformNativeHost;
  preloadedPersistedData: StorageState;
};

export function render(appDependencies: AppDependencies) {
  queryClientRef.current = queryClient;

  const store = createStoreInstance({
    preloadedPersistedData: appDependencies.preloadedPersistedData,
  });
  storeRef.current = store;
  dispatchRef.current = store.dispatch;

  clipboardRef.current = appDependencies.clipboard;
  fileIconThemeRef.current = appDependencies.fileIconTheme;
  fileSystemRef.current = appDependencies.fileSystem;
  nativeHostRef.current = appDependencies.nativeHost;

  ReactDOM.render(
    <React.StrictMode>
      <Providers store={store}>
        <Shell />
      </Providers>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
