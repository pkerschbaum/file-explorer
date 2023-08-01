import { Emitter } from '@app/base/event';
import { network } from '@app/base/network';
import type { UriComponents } from '@app/base/uri';
import { functions } from '@app/base/utils/functions.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import type { PlatformNativeHost } from '@app/platform/native-host.types';
import { CLIPBOARD_CHANGED_DATA_TYPE } from '@app/platform/native-host.types';

export function createFakeNativeHost(): PlatformNativeHost {
  let currentClipboardText = '';
  let currentClipboardResources: UriComponents[] = [];
  const clipboardChangedEmitter = new Emitter<CLIPBOARD_CHANGED_DATA_TYPE>();

  return {
    app: {
      getPath: () => Promise.resolve(uriHelper.parseUri(network.Schemas.file, `/home/testdir`)),
      isResourceQualifiedForThumbnail: () => false,
      getThumbnailURLForResource: () => undefined,
      isResourceQualifiedForNativeIcon: () => false,
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
      readText: () => currentClipboardText,
      writeText: (value) => {
        currentClipboardText = value;
        clipboardChangedEmitter.fire(CLIPBOARD_CHANGED_DATA_TYPE.TEXT);
      },
      readResources: () => currentClipboardResources,
      writeResources: (resources) => {
        currentClipboardResources = resources;
        clipboardChangedEmitter.fire(CLIPBOARD_CHANGED_DATA_TYPE.RESOURCES);
      },
      onClipboardChanged: clipboardChangedEmitter.event,
    },
    webContents: {
      startNativeFileDnD: functions.noop,
    },
  };
}
