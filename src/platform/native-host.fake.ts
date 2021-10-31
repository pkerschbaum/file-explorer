import { Emitter } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';

import { functions } from '@app/base/utils/functions.util';
import { PlatformNativeHost } from '@app/platform/native-host';

export function createFakeNativeHost(): PlatformNativeHost {
  return {
    app: {
      getNativeFileIconDataURL: () => Promise.resolve(undefined),
    },
    shell: {
      revealResourcesInOS: () => Promise.resolve(),
      openPath: () => Promise.resolve(),
    },
    window: {
      minimize: () => Promise.resolve(),
      toggleMaximized: () => Promise.resolve(),
      close: () => Promise.resolve(),
    },
    clipboard: {
      readResources: () => [],
      writeResources: functions.noop,
      onClipboardChanged: new Emitter<void>().event,
    },
    webContents: {
      startNativeFileDnD: functions.noop,
    },
  };
}
