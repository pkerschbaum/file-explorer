import { Emitter } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';

import { functions } from '@app/base/utils/functions.util';
import { PlatformNativeHost } from '@app/platform/native-host';

export function createFakeNativeHost(): PlatformNativeHost {
  return {
    clipboard: {
      readResources: () => [],
      writeResources: functions.noop,
      onClipboardChanged: new Emitter<void>().event,
    },
    window: {
      minimize: () => Promise.resolve(),
      toggleMaximized: () => Promise.resolve(),
      close: () => Promise.resolve(),
    },
    revealResourcesInOS: () => Promise.resolve(),
    openPath: () => Promise.resolve(),
    getNativeFileIconDataURL: () => Promise.resolve(undefined),
    startNativeFileDnD: functions.noop,
  };
}
