import type { QueryClient } from 'react-query';

import type { PlatformFileIconThemeLoader } from '@file-explorer/platform/file-icon-theme-loader.types';
import type { PlatformFileSystem } from '@file-explorer/platform/file-system.types';
import type { PlatformLogWriter } from '@file-explorer/platform/log-writer.types';
import type { PlatformNativeHost } from '@file-explorer/platform/native-host.types';
import type { PlatformPersistentStorage } from '@file-explorer/platform/persistent-storage.types';

import type { AppDispatch, RootStore } from '#pkg/global-state/store';

type GlobalModules = {
  queryClient: QueryClient;

  store: RootStore;
  dispatch: AppDispatch;

  fileIconThemeLoader: PlatformFileIconThemeLoader;
  fileSystem: PlatformFileSystem;
  logWriter: PlatformLogWriter;
  nativeHost: PlatformNativeHost;
  persistentStorage: PlatformPersistentStorage;
};

declare global {
  // eslint-disable-next-line no-var
  var modules: GlobalModules;
}

export function setGlobalModules(modulesToSet: Partial<GlobalModules>) {
  global.modules = {
    ...global.modules,
    ...modulesToSet,
  };
}
