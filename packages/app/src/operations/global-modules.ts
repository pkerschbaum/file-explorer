import type { QueryClient } from 'react-query';

import type { AppDispatch, RootStore } from '@app/global-state/store';
import type { PlatformFileIconThemeLoader } from '@app/platform/file-icon-theme-loader.types';
import type { PlatformFileSystem } from '@app/platform/file-system.types';
import type { PlatformLogWriter } from '@app/platform/log-writer.types';
import type { PlatformNativeHost } from '@app/platform/native-host.types';
import type { PlatformPersistentStorage } from '@app/platform/persistent-storage.types';

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
