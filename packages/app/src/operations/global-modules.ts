import { QueryClient } from 'react-query';

import { AppDispatch, RootStore } from '@app/global-state/store';
import { PlatformFileIconThemeLoader } from '@app/platform/file-icon-theme-loader.types';
import { PlatformFileSystem } from '@app/platform/file-system.types';
import { PlatformLogWriter } from '@app/platform/log-writer.types';
import { PlatformNativeHost } from '@app/platform/native-host.types';
import { PlatformPersistentStorage } from '@app/platform/persistent-storage.types';

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
