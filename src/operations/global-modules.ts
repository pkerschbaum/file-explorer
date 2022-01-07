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

  queryClientRef.current = global.modules.queryClient;

  storeRef.current = global.modules.store;
  dispatchRef.current = global.modules.dispatch;

  fileIconThemeLoaderRef.current = global.modules.fileIconThemeLoader;
  fileSystemRef.current = global.modules.fileSystem;
  logWriterRef.current = global.modules.logWriter;
  nativeHostRef.current = global.modules.nativeHost;
  persistentStorageRef.current = global.modules.persistentStorage;
}

export const queryClientRef: { current: QueryClient } = { current: null } as any;

export const storeRef: { current: RootStore } = { current: null } as any;
export const dispatchRef: { current: AppDispatch } = { current: null } as any;

export const fileIconThemeLoaderRef: { current: PlatformFileIconThemeLoader } = {
  current: null,
} as any;
export const fileSystemRef: { current: PlatformFileSystem } = { current: null } as any;
export const logWriterRef: { current: PlatformLogWriter } = {
  current: null,
} as any;
export const nativeHostRef: { current: PlatformNativeHost } = { current: null } as any;
export const persistentStorageRef: { current: PlatformPersistentStorage } = {
  current: null,
} as any;
