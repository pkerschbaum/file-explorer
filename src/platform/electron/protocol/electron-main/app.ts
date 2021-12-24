import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { app, protocol } from 'electron';
import FileType from 'file-type';
import mime from 'mime';

import { check } from '@app/base/utils/assert.util';
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

export function registerProtocols(fileService: IFileService): void {
  protocol.registerBufferProtocol(THUMBNAIL_PROTOCOL_SCHEME, (request, callback) => {
    void getThumbnail(request.url, fileService)
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

type BufferResult = {
  data: Buffer;
  mimeType?: string;
};

async function getThumbnail(url: string, fileService: IFileService): Promise<BufferResult> {
  const uri = URI.parse(
    decodeURIComponent(url.substring(`${THUMBNAIL_PROTOCOL_SCHEME}:///`.length)),
  );

  const fileContent = await fileService.readFile(uri);
  const fileContentBuffer = Buffer.from(fileContent.value.buffer);
  const mimeTypeBasedOnContent = (await FileType.fromBuffer(fileContentBuffer))?.mime;

  const extension = uriHelper.extractExtension(uri);
  const mimeTypeBasedOnExtension = check.isNullishOrEmptyString(extension)
    ? undefined
    : mime.getType(extension);

  return {
    data: fileContentBuffer,
    mimeType: mimeTypeBasedOnContent ?? mimeTypeBasedOnExtension ?? undefined,
  };
}

async function getNativeFileIcon(url: string): Promise<BufferResult> {
  const uri = URI.parse(
    decodeURIComponent(url.substring(`${NATIVE_FILE_ICON_PROTOCOL_SCHEME}:///`.length)),
  );
  const icon = await app.getFileIcon(uri.fsPath, { size: 'large' });

  return { data: icon.toPNG(), mimeType: 'image/png' };
}
