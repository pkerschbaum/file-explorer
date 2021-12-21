import { Emitter } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

import { functions } from '@app/base/utils/functions.util';
import type { PlatformNativeHost } from '@app/platform/native-host.types';

export function createFakeNativeHost(): PlatformNativeHost {
  let currentClipboardValue: UriComponents[] = [];
  const clipboardChangedEmitter = new Emitter<void>();

  return {
    app: {
      getPath: () => Promise.resolve(URI.parse(`${Schemas.inMemory}:///home/testdir`).toJSON()),
      getThumbnailURLForResource: () => undefined,
      getNativeIconURLForResource: () => undefined,
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
