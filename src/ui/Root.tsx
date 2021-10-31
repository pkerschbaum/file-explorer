import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { TagsState } from '@app/global-state/slices/tags.slice';
import { createStoreInstance } from '@app/global-state/store';
import {
  dispatchRef,
  fileIconThemeRef,
  fileSystemRef,
  nativeHostRef,
  persistentStorageRef,
  queryClientRef,
  storeRef,
} from '@app/operations/global-modules';
import { PlatformFileIconTheme } from '@app/platform/file-icon-theme';
import { PlatformFileSystem } from '@app/platform/file-system';
import { PlatformNativeHost } from '@app/platform/native-host';
import { PlatformPersistentStorage } from '@app/platform/persistent-storage';
import { createQueryClient, Globals } from '@app/ui/Globals';
import { Shell } from '@app/ui/shell';

export type AppDependencies = {
  fileIconTheme: PlatformFileIconTheme;
  fileSystem: PlatformFileSystem;
  nativeHost: PlatformNativeHost;
  persistentStorage: PlatformPersistentStorage;
  preloadedPersistedData: TagsState;
};

export function render(appDependencies: AppDependencies) {
  const queryClient = createQueryClient();
  queryClientRef.current = queryClient;

  const store = createStoreInstance({
    preloadedState: {
      tagsSlice: appDependencies.preloadedPersistedData,
    },
  });
  storeRef.current = store;
  dispatchRef.current = store.dispatch;

  fileIconThemeRef.current = appDependencies.fileIconTheme;
  fileSystemRef.current = appDependencies.fileSystem;
  nativeHostRef.current = appDependencies.nativeHost;
  persistentStorageRef.current = appDependencies.persistentStorage;

  ReactDOM.render(
    <React.StrictMode>
      <Globals queryClient={queryClient} store={store}>
        <Shell />
      </Globals>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
