import { QueryClient } from 'react-query';

import { AppDispatch, RootStore } from '@app/global-state/store';
import { PlatformClipboard } from '@app/platform/clipboard';
import { PlatformFileIconTheme } from '@app/platform/file-icon-theme';
import { PlatformFileSystem } from '@app/platform/file-system';
import { PlatformNativeHost } from '@app/platform/native-host';
import { PlatformPersistentStorage } from '@app/platform/persistent-storage';

export const queryClientRef: { current: QueryClient } = { current: undefined } as any;

export const storeRef: { current: RootStore } = { current: undefined } as any;
export const dispatchRef: { current: AppDispatch } = { current: undefined } as any;

export const clipboardRef: { current: PlatformClipboard } = { current: undefined } as any;
export const fileIconThemeRef: { current: PlatformFileIconTheme } = { current: undefined } as any;
export const fileSystemRef: { current: PlatformFileSystem } = { current: undefined } as any;
export const nativeHostRef: { current: PlatformNativeHost } = { current: undefined } as any;
export const persistentStorageRef: { current: PlatformPersistentStorage } = {
  current: undefined,
} as any;
