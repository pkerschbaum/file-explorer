import { PlatformNativeHost } from '@app/platform/native-host';

export const fakeNativeHost: PlatformNativeHost = {
  revealResourcesInOS: () => undefined,
  openPath: () => Promise.resolve(),
  getNativeFileIconDataURL: () => Promise.resolve(undefined),
  startNativeFileDnD: () => undefined,
};
