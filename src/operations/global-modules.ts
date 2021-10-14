import { QueryClient } from 'react-query';

import { AppDispatch, RootStore } from '@app/global-state/store';
import { NexClipboard } from '@app/platform/clipboard';
import { FileIconTheme } from '@app/platform/file-icon-theme';
import { NexFileSystem } from '@app/platform/file-system';
import { NexNativeHost } from '@app/platform/native-host';
import { NexStorage } from '@app/platform/storage';

export const queryClientRef: { current: QueryClient } = { current: undefined } as any;

export const storeRef: { current: RootStore } = { current: undefined } as any;
export const dispatchRef: { current: AppDispatch } = { current: undefined } as any;

export const clipboardRef: { current: NexClipboard } = { current: undefined } as any;
export const fileIconThemeRef: { current: FileIconTheme } = { current: undefined } as any;
export const fileSystemRef: { current: NexFileSystem } = { current: undefined } as any;
export const nativeHostRef: { current: NexNativeHost } = { current: undefined } as any;
export const storageRef: { current: NexStorage } = { current: undefined } as any;
