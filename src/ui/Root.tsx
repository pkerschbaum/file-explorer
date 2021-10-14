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
  storageRef,
  storeRef,
} from '@app/operations/global-modules';
import { store } from '@app/global-state/store';
import { NexClipboard } from '@app/platform/clipboard';
import { FileIconTheme } from '@app/platform/file-icon-theme';
import { NexFileSystem } from '@app/platform/file-system';
import { NexNativeHost } from '@app/platform/native-host';
import { NexStorage } from '@app/platform/storage';

export type AppDependencies = {
  clipboard: NexClipboard;
  fileIconTheme: FileIconTheme;
  fileSystem: NexFileSystem;
  nativeHost: NexNativeHost;
  storage: NexStorage;
};

export function render(appDependencies: AppDependencies) {
  queryClientRef.current = queryClient;

  storeRef.current = store;
  dispatchRef.current = store.dispatch;

  clipboardRef.current = appDependencies.clipboard;
  fileIconThemeRef.current = appDependencies.fileIconTheme;
  fileSystemRef.current = appDependencies.fileSystem;
  nativeHostRef.current = appDependencies.nativeHost;
  storageRef.current = appDependencies.storage;

  ReactDOM.render(
    <React.StrictMode>
      <Providers>
        <Shell />
      </Providers>
    </React.StrictMode>,
    document.getElementById('root'),
  );
}
