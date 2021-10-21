import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Globals, queryClient } from '@app/ui/Globals';
import { Shell } from '@app/ui/Shell';
import {
  dispatchRef,
  fileIconThemeRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
  queryClientRef,
  storeRef,
} from '@app/operations/global-modules';
import { createStoreInstance } from '@app/global-state/store';
import { StorageState } from '@app/global-state/slices/persisted.slice';
import { PlatformFileIconTheme } from '@app/platform/file-icon-theme';
import { PlatformFileSystem } from '@app/platform/file-system';
import { PlatformNativeHost } from '@app/platform/native-host';
import { PlatformPersistentStorage } from '@app/platform/persistent-storage';

export type AppDependencies = {
  fileIconTheme: PlatformFileIconTheme;
  fileSystem: PlatformFileSystem;
  nativeHost: PlatformNativeHost;
  persistentStorage: PlatformPersistentStorage;
  preloadedPersistedData: StorageState;
};

export function render(appDependencies: AppDependencies) {
  queryClientRef.current = queryClient;

  const store = createStoreInstance({
    preloadedPersistedData: appDependencies.preloadedPersistedData,
  });
  storeRef.current = store;
  dispatchRef.current = store.dispatch;

  fileIconThemeRef.current = appDependencies.fileIconTheme;
  fileSystemRef.current = appDependencies.fileSystem;
  nativeHostRef.current = appDependencies.nativeHost;
  persistentStorageRef.current = appDependencies.persistentStorage;

  ReactDOM.render(
    <React.StrictMode>
      <Globals store={store}>
        <Shell />
      </Globals>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
