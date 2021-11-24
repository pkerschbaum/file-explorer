import { QueryClient } from 'react-query';

import { AppDispatch, RootStore } from '@app/global-state/store';
import { PlatformFileIconThemeLoader } from '@app/platform/file-icon-theme-loader';
import { PlatformFileSystem } from '@app/platform/file-system';
import { PlatformLogWriter } from '@app/platform/log-writer';
import { PlatformNativeHost } from '@app/platform/native-host';
import { PlatformPersistentStorage } from '@app/platform/persistent-storage';

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
