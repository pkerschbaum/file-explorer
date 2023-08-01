import type electron from 'electron';
import { app, protocol } from 'electron';
import FileType from 'file-type';
import fs from 'fs';
import mime from 'mime';
import sharp from 'sharp';
import invariant from 'tiny-invariant';

import { URI } from '#pkg/base/uri';
import { check } from '#pkg/base/utils/assert.util';
import { numbers } from '#pkg/base/utils/numbers.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import {
  NATIVE_FILE_ICON_PROTOCOL_SCHEME,
  THUMBNAIL_PROTOCOL_SCHEME,
} from '#pkg/platform/electron/protocol/common/app';

const DEFAULT_ERROR = {
  error: -2, // "A generic failure occurred." from https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h;l=32
};

export function registerProtocols(): void {
  protocol.registerStreamProtocol(THUMBNAIL_PROTOCOL_SCHEME, (request, callback) => {
    void getThumbnail(request)
      .then(callback)
      .catch(() => {
        callback(DEFAULT_ERROR);
      });
  });
  protocol.registerBufferProtocol(NATIVE_FILE_ICON_PROTOCOL_SCHEME, (request, callback) => {
    void getNativeFileIcon(request)
      .then(callback)
      .catch(() => {
        callback(DEFAULT_ERROR);
      });
  });
}

type ProtocolStreamResponse = electron.ProtocolResponse & {
  data: NodeJS.ReadableStream;
};

type ProtocolBufferResponse = electron.ProtocolResponse & {
  data: Buffer;
};

// Skip resizing of SVGs (because vector images should just get served to the UI)
const THUMBNAIL_RESIZE_BLOCKLIST = ['image/svg+xml'];
async function getThumbnail(request: electron.ProtocolRequest): Promise<ProtocolStreamResponse> {
  const parsed = new URL(request.url);
  // property "pathname" has a leading slash --> remove that (https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname)
  const path = parsed.pathname.substring(1);
  const uri = URI.parse(decodeURIComponent(path));
  const requestedHeight = parsed.searchParams.get('height');
  const parsedHeight = numbers.convert(requestedHeight);
  invariant(parsedHeight !== undefined);

  const mimeTypeBasedOnContent = (await FileType.fromFile(URI.fsPath(uri)))?.mime;
  const extension = uriHelper.extractExtension(uri);
  const mimeTypeBasedOnExtension = check.isNullishOrEmptyString(extension)
    ? undefined
    : mime.getType(extension);
  const finalMimeType = mimeTypeBasedOnContent ?? mimeTypeBasedOnExtension ?? undefined;

  let thumbnailStream;
  if (finalMimeType === undefined || THUMBNAIL_RESIZE_BLOCKLIST.includes(finalMimeType)) {
    thumbnailStream = fs.createReadStream(URI.fsPath(uri));
  } else {
    thumbnailStream = fs.createReadStream(URI.fsPath(uri)).pipe(
      sharp({
        // set animated to `true` to keep animated GIFs and WebPs
        animated: true,
      }).resize({ height: parsedHeight }),
    );
  }

  return {
    data: thumbnailStream,
    mimeType: finalMimeType,
    headers: {
      'cache-control': `max-age=${60 * 60 * 24}`, // cache for 1 day
    },
  };
}

async function getNativeFileIcon(
  request: electron.ProtocolRequest,
): Promise<ProtocolBufferResponse> {
  const parsed = new URL(request.url);
  // property "pathname" has a leading slash --> remove that (https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname)
  const path = parsed.pathname.substring(1);
  const uri = URI.parse(decodeURIComponent(path));
  const icon = await app.getFileIcon(URI.fsPath(uri), { size: 'large' });

  return {
    data: icon.toPNG(),
    mimeType: 'image/png',
    headers: {
      'cache-control': `max-age=${60 * 60}`, // cache for 1 hour
    },
  };
}
