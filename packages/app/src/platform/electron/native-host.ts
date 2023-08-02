import mime from 'mime';
import invariant from 'tiny-invariant';

import { Emitter } from '#pkg/base/event';
import { URI } from '#pkg/base/uri';
import { check } from '#pkg/base/utils/assert.util';
import { numbers } from '#pkg/base/utils/numbers.util';
import { trpc } from '#pkg/platform/electron/file-explorer-agent-client/agent-client';
import {
  NATIVE_FILE_ICON_PROTOCOL_SCHEME,
  THUMBNAIL_PROTOCOL_SCHEME,
} from '#pkg/platform/electron/protocol/common/app';
import type { PlatformNativeHost } from '#pkg/platform/native-host.types';
import { CLIPBOARD_CHANGED_DATA_TYPE } from '#pkg/platform/native-host.types';

const USE_NATIVE_ICON_FOR_REGEX = /exe|ico|dll|iso/i;
const THUMBNAIL_AVAILABLE_FOR_MIME_TYPE = new Set([
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/gif',
  'image/webp',
]);

export const createNativeHost = () => {
  const onClipboardChanged = new Emitter<CLIPBOARD_CHANGED_DATA_TYPE>();

  const instance: PlatformNativeHost = {
    app: {
      getPath: trpc.app.getPath.mutate,
      isResourceQualifiedForThumbnail: (resource) => {
        if (check.isNullishOrEmptyString(resource.extension)) {
          return false;
        }

        const mimeType = mime.getType(resource.extension);
        return check.isNonEmptyString(mimeType) && THUMBNAIL_AVAILABLE_FOR_MIME_TYPE.has(mimeType);
      },
      getThumbnailURLForResource: (resource, height) => {
        const isResourceQualifiedForThumbnailURL =
          instance.app.isResourceQualifiedForThumbnail(resource) &&
          check.isNotNullish(resource.mtime);

        if (!isResourceQualifiedForThumbnailURL) {
          return undefined;
        } else {
          invariant(check.isNotNullish(resource.mtime));
          const url = new URL(
            `${THUMBNAIL_PROTOCOL_SCHEME}:///${encodeURIComponent(URI.toString(resource.uri))}`,
          );
          // add mtime as search param so that the browser does not use its cache if the file changed
          url.searchParams.set('mtime', numbers.toString(resource.mtime));
          url.searchParams.set('height', numbers.toString(height));
          return url.toString();
        }
      },
      isResourceQualifiedForNativeIcon: (resource) => {
        const extension = resource.extension;
        return check.isNonEmptyString(extension) && USE_NATIVE_ICON_FOR_REGEX.test(extension);
      },
      getNativeIconURLForResource: (resource) => {
        const isResourceQualifiedForNativeIconURL =
          instance.app.isResourceQualifiedForNativeIcon(resource) &&
          check.isNotNullish(resource.mtime);

        if (!isResourceQualifiedForNativeIconURL) {
          return undefined;
        } else {
          invariant(check.isNotNullish(resource.mtime));
          const url = new URL(
            `${NATIVE_FILE_ICON_PROTOCOL_SCHEME}:///${encodeURIComponent(
              URI.toString(resource.uri),
            )}`,
          );
          // add mtime as search param so that the browser does not use its cache if the file changed
          url.searchParams.set('mtime', numbers.toString(resource.mtime));
          return url.toString();
        }
      },
    },
    shell: {
      revealResourcesInOS: async (resources) => {
        for (const resource of resources) {
          await trpc.shell.showItemInFolder.mutate({ resource });
        }
      },
      openPath: async (resources) => {
        for (const resource of resources) {
          await trpc.shell.openPath.mutate({ resource });
        }
      },
    },
    window: {
      minimize: trpc.window.minimize.mutate,
      toggleMaximized: trpc.window.toggleMaximize.mutate,
      close: trpc.window.close.mutate,
    },
    clipboard: {
      readText: trpc.clipboard.readText.query,
      writeText: async (value) => {
        await trpc.clipboard.writeText.mutate({ value });
        onClipboardChanged.fire(CLIPBOARD_CHANGED_DATA_TYPE.TEXT);
      },
      readResources: trpc.clipboard.readResources.query,
      writeResources: async (resources) => {
        await trpc.clipboard.writeResources.mutate({ resources });
        onClipboardChanged.fire(CLIPBOARD_CHANGED_DATA_TYPE.RESOURCES);
      },
      onClipboardChanged: onClipboardChanged.event,
    },
    webContents: {
      startNativeFileDnD: (resources) =>
        window.privileged.webContents.fileDragStart({
          fsPaths: resources.map((resource) => URI.fsPath(resource)),
        }),
    },
  };

  return instance;
};
