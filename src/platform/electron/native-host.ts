import { Emitter } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import mime from 'mime';

import { check } from '@app/base/utils/assert.util';
import {
  NATIVE_FILE_ICON_PROTOCOL_SCHEME,
  THUMBNAIL_PROTOCOL_SCHEME,
} from '@app/platform/electron/protocol/common/app';
import type { PlatformNativeHost } from '@app/platform/native-host.types';

const USE_NATIVE_ICON_FOR_REGEX = /(?:exe|ico|dll)/i;
const THUMBNAIL_AVAILABLE_FOR_MIME_TYPE = ['image/png', 'image/jpeg', 'image/svg+xml'];

export const createNativeHost = () => {
  const onClipboardChanged = new Emitter<void>();

  const instance: PlatformNativeHost = {
    app: {
      getPath: async (args) => {
        const fsPath = await window.privileged.app.getPath(args);
        return URI.file(fsPath);
      },
      getThumbnailURLForResource: (resource) => {
        if (check.isNullishOrEmptyString(resource.extension)) {
          return undefined;
        }

        const mimeType = mime.getType(resource.extension);
        const isResourceQualifiedForThumbnail =
          check.isNonEmptyString(mimeType) && THUMBNAIL_AVAILABLE_FOR_MIME_TYPE.includes(mimeType);

        if (!isResourceQualifiedForThumbnail) {
          return undefined;
        } else {
          return `${THUMBNAIL_PROTOCOL_SCHEME}:///${encodeURIComponent(
            URI.from(resource.uri).toString(),
          )}`;
        }
      },
      getNativeIconURLForResource: (resource) => {
        const extension = resource.extension;
        const isResourceQualifiedForNativeIcon =
          check.isNonEmptyString(extension) && USE_NATIVE_ICON_FOR_REGEX.test(extension);

        if (!isResourceQualifiedForNativeIcon) {
          return undefined;
        } else {
          return `${NATIVE_FILE_ICON_PROTOCOL_SCHEME}:///${encodeURIComponent(
            URI.from(resource.uri).toString(),
          )}`;
        }
      },
    },
    shell: {
      revealResourcesInOS: async (resources) => {
        for (const resource of resources) {
          await window.privileged.shell.revealResourcesInOS({ fsPath: URI.from(resource).fsPath });
        }
      },
      openPath: async (resources) => {
        for (const resource of resources) {
          await window.privileged.shell.openPath({ fsPath: URI.from(resource).fsPath });
        }
      },
    },
    window: {
      minimize: window.privileged.window.minimize,
      toggleMaximized: window.privileged.window.toggleMaximized,
      close: window.privileged.window.close,
    },
    clipboard: {
      readResources: window.privileged.clipboard.readResources,
      writeResources: (resources) => {
        if (resources.length) {
          window.privileged.clipboard.writeResources(resources.map((r) => URI.from(r)));
          onClipboardChanged.fire();
        }
      },
      onClipboardChanged: onClipboardChanged.event,
    },
    webContents: {
      startNativeFileDnD: (resource) =>
        window.privileged.webContents.fileDragStart({ fsPath: URI.from(resource).fsPath }),
    },
  };

  return instance;
};
