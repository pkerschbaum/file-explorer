import { Emitter } from '@file-explorer/code-oss-ecma/event';
import { network } from '@file-explorer/code-oss-ecma/network';
import type { UriComponents } from '@file-explorer/code-oss-ecma/uri';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import type { PlatformNativeHost } from '#pkg/native-host.types';
import { CLIPBOARD_CHANGED_DATA_TYPE } from '#pkg/native-host.types';

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
    clipboard: {
      readText: () => Promise.resolve(currentClipboardText),
      writeText: (value) => {
        currentClipboardText = value;
        clipboardChangedEmitter.fire(CLIPBOARD_CHANGED_DATA_TYPE.TEXT);
      },
      readResources: () => Promise.resolve(currentClipboardResources),
      writeResources: (resources) => {
        currentClipboardResources = resources;
        clipboardChangedEmitter.fire(CLIPBOARD_CHANGED_DATA_TYPE.RESOURCES);
      },
      onClipboardChanged: clipboardChangedEmitter.event,
    },
    nativeDND: {
      start: () => Promise.resolve(),
    },
  };
}
