import { Emitter } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { functions } from '@app/base/utils/functions.util';
import { PlatformNativeHost } from '@app/platform/native-host';

import { fakeFileStat } from '@app-test/utils/fake-data';

export function createFakeNativeHost(): PlatformNativeHost {
  let currentClipboardValue: UriComponents[] = [];
  const clipboardChangedEmitter = new Emitter<void>();

  return {
    app: {
      getNativeFileIconDataURL: () => Promise.resolve(undefined),
      getPath: () => Promise.resolve(fakeFileStat.resource),
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
      readResources: () => currentClipboardValue,
      writeResources: (resources) => {
        currentClipboardValue = resources;
        clipboardChangedEmitter.fire();
      },
      onClipboardChanged: clipboardChangedEmitter.event,
    },
    webContents: {
      startNativeFileDnD: functions.noop,
    },
  };
}
