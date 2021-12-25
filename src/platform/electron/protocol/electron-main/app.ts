import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { app, protocol } from 'electron';
import FileType from 'file-type';
import fs from 'fs';
import mime from 'mime';
import sharp from 'sharp';
import invariant from 'tiny-invariant';

import { check } from '@app/base/utils/assert.util';
import { numbers } from '@app/base/utils/numbers.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import {
  NATIVE_FILE_ICON_PROTOCOL_SCHEME,
  THUMBNAIL_PROTOCOL_SCHEME,
} from '@app/platform/electron/protocol/common/app';

const DEFAULT_ERROR = {
  error: -2, // "A generic failure occurred." from https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h;l=32
};
const DEFAULT_HEADERS = {
  'cache-control': 'max-age=3600', // cache for 1 hour
};

export function registerProtocols(): void {
  protocol.registerStreamProtocol(THUMBNAIL_PROTOCOL_SCHEME, (request, callback) => {
    void getThumbnail(request.url)
      .then(({ data, mimeType }) => {
        callback({
          data,
          mimeType,
          headers: DEFAULT_HEADERS,
        });
      })
      .catch(() => {
        callback(DEFAULT_ERROR);
      });
  });
  protocol.registerBufferProtocol(NATIVE_FILE_ICON_PROTOCOL_SCHEME, (request, callback) => {
    void getNativeFileIcon(request.url)
      .then(({ data, mimeType }) => {
        callback({
          data,
          mimeType,
          headers: DEFAULT_HEADERS,
        });
      })
      .catch(() => {
        callback(DEFAULT_ERROR);
      });
  });
}

type StreamResult = {
  data: NodeJS.ReadableStream;
  mimeType?: string;
};

type BufferResult = {
  data: Buffer;
  mimeType?: string;
};

const THUMBNAIL_RESIZE_BLOCKLIST = ['image/svg+xml'];
async function getThumbnail(url: string): Promise<StreamResult> {
  const parsed = new URL(url);
  // property "pathname" has a leading slash --> remove that (https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname)
  const path = parsed.pathname.substring(1);
  const uri = URI.parse(decodeURIComponent(path));
  const requestedHeight = parsed.searchParams.get('height');
  const parsedHeight = numbers.convert(requestedHeight);
  invariant(parsedHeight !== undefined);

  const mimeTypeBasedOnContent = (await FileType.fromFile(uri.fsPath))?.mime;
  const extension = uriHelper.extractExtension(uri);
  const mimeTypeBasedOnExtension = check.isNullishOrEmptyString(extension)
    ? undefined
    : mime.getType(extension);
  const finalMimeType = mimeTypeBasedOnContent ?? mimeTypeBasedOnExtension ?? undefined;

  let thumbnailStream;
  if (finalMimeType === undefined || THUMBNAIL_RESIZE_BLOCKLIST.includes(finalMimeType)) {
    thumbnailStream = fs.createReadStream(uri.fsPath);
  } else {
    thumbnailStream = fs
      .createReadStream(uri.fsPath)
      .pipe(sharp().resize({ height: parsedHeight }));
  }

  return {
    data: thumbnailStream,
    mimeType: finalMimeType,
  };
}

async function getNativeFileIcon(url: string): Promise<BufferResult> {
  const uri = URI.parse(
    decodeURIComponent(url.substring(`${NATIVE_FILE_ICON_PROTOCOL_SCHEME}:///`.length)),
  );
  const icon = await app.getFileIcon(uri.fsPath, { size: 'large' });

  return { data: icon.toPNG(), mimeType: 'image/png' };
}
