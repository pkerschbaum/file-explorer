import { NexNativeHost } from '@app/platform/logic/native-host';

export const fakeNativeHost: NexNativeHost = {
  revealResourcesInOS: () => undefined,
  openPath: () => Promise.resolve(),
  getNativeFileIconDataURL: () => Promise.resolve(undefined),
  startNativeFileDnD: () => undefined,
};
