import mime from 'mime';
import invariant from 'tiny-invariant';

import { URI, UriComponents } from '@file-explorer/code-oss-ecma/uri';
import { check } from '@file-explorer/commons-ecma/util/assert.util';
import { numbers } from '@file-explorer/commons-ecma/util/numbers.util';

import {
  AGENT_PORT,
  NATIVE_FILE_ICON_PATH,
  THUMBNAIL_PATH,
} from '#pkg/file-explorer-agent/constants';

const USE_NATIVE_ICON_FOR_REGEX = /exe|ico|dll|iso/i;
const THUMBNAIL_AVAILABLE_FOR_MIME_TYPE = new Set([
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/gif',
  'image/webp',
]);

type Resource = {
  uri: UriComponents;
  mtime?: number;
  extension?: string;
};

export const blob = {
  isResourceQualifiedForThumbnail: (resource: Resource) => {
    if (check.isNullishOrEmptyString(resource.extension)) {
      return false;
    }

    const mimeType = mime.getType(resource.extension);
    return check.isNonEmptyString(mimeType) && THUMBNAIL_AVAILABLE_FOR_MIME_TYPE.has(mimeType);
  },
  getThumbnailURLForResource: (resource: Resource, height: number) => {
    const isResourceQualifiedForThumbnailURL =
      blob.isResourceQualifiedForThumbnail(resource) && check.isNotNullish(resource.mtime);

    if (!isResourceQualifiedForThumbnailURL) {
      return undefined;
    } else {
      invariant(check.isNotNullish(resource.mtime));
      const url = new URL(
        `http://localhost:${AGENT_PORT}${THUMBNAIL_PATH}/${encodeURIComponent(
          URI.toString(resource.uri),
        )}`,
      );
      // add mtime as search param so that the browser does not use its cache if the file changed
      url.searchParams.set('mtime', numbers.toString(resource.mtime));
      url.searchParams.set('height', numbers.toString(height));
      return url.toString();
    }
  },
  isResourceQualifiedForNativeIcon: (resource: Resource) => {
    const extension = resource.extension;
    return check.isNonEmptyString(extension) && USE_NATIVE_ICON_FOR_REGEX.test(extension);
  },
  getNativeIconURLForResource: (resource: Resource) => {
    const isResourceQualifiedForNativeIconURL =
      blob.isResourceQualifiedForNativeIcon(resource) && check.isNotNullish(resource.mtime);

    if (!isResourceQualifiedForNativeIconURL) {
      return undefined;
    } else {
      invariant(check.isNotNullish(resource.mtime));
      const url = new URL(
        `http://localhost:${AGENT_PORT}${NATIVE_FILE_ICON_PATH}/${encodeURIComponent(
          URI.toString(resource.uri),
        )}`,
      );
      // add mtime as search param so that the browser does not use its cache if the file changed
      url.searchParams.set('mtime', numbers.toString(resource.mtime));
      return url.toString();
    }
  },
};
