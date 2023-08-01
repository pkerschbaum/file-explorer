import mime from 'mime';
import invariant from 'tiny-invariant';

import { Emitter } from '#pkg/base/event';
import { network } from '#pkg/base/network';
import { URI } from '#pkg/base/uri';
import { check } from '#pkg/base/utils/assert.util';
import { numbers } from '#pkg/base/utils/numbers.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import {
  NATIVE_FILE_ICON_PROTOCOL_SCHEME,
  THUMBNAIL_PROTOCOL_SCHEME,
} from '#pkg/platform/electron/protocol/common/app';
import type { PlatformNativeHost } from '#pkg/platform/native-host.types';
import { CLIPBOARD_CHANGED_DATA_TYPE } from '#pkg/platform/native-host.types';

const USE_NATIVE_ICON_FOR_REGEX = /exe|ico|dll|iso/i;
const THUMBNAIL_AVAILABLE_FOR_MIME_TYPE = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/gif',
  'image/webp',
];

export const createNativeHost = () => {
  const onClipboardChanged = new Emitter<CLIPBOARD_CHANGED_DATA_TYPE>();

  const instance: PlatformNativeHost = {
    app: {
      getPath: async (args) => {
        const fsPath = await window.privileged.app.getPath(args);
        return uriHelper.parseUri(network.Schemas.file, fsPath);
      },
      isResourceQualifiedForThumbnail: (resource) => {
        if (check.isNullishOrEmptyString(resource.extension)) {
          return false;
        }

        const mimeType = mime.getType(resource.extension);
        return (
          check.isNonEmptyString(mimeType) && THUMBNAIL_AVAILABLE_FOR_MIME_TYPE.includes(mimeType)
        );
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
          await window.privileged.shell.revealResourcesInOS({ fsPath: URI.fsPath(resource) });
        }
      },
      openPath: async (resources) => {
        for (const resource of resources) {
          await window.privileged.shell.openPath({ fsPath: URI.fsPath(resource) });
        }
      },
    },
    window: {
      minimize: window.privileged.window.minimize,
      toggleMaximized: window.privileged.window.toggleMaximized,
      close: window.privileged.window.close,
    },
    clipboard: {
      readText: window.privileged.clipboard.readText,
      writeText: (value) => {
        window.privileged.clipboard.writeText(value);
        onClipboardChanged.fire(CLIPBOARD_CHANGED_DATA_TYPE.TEXT);
      },
      readResources: window.privileged.clipboard.readResources,
      writeResources: (resources) => {
        window.privileged.clipboard.writeResources(resources);
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
