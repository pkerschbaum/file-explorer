import type { QueryClient } from 'react-query';

import type { AppDispatch, RootStore } from '#pkg/global-state/store';
import type { PlatformFileIconThemeLoader } from '#pkg/platform/file-icon-theme-loader.types';
import type { PlatformFileSystem } from '#pkg/platform/file-system.types';
import type { PlatformLogWriter } from '#pkg/platform/log-writer.types';
import type { PlatformNativeHost } from '#pkg/platform/native-host.types';
import type { PlatformPersistentStorage } from '#pkg/platform/persistent-storage.types';

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
