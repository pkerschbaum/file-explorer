import { app, protocol } from 'electron';

import { NATIVE_FILE_ICON_PROTOCOL_SCHEME } from '@app/platform/electron/protocol/common/app';

export function registerProtocols(): void {
  protocol.registerBufferProtocol(NATIVE_FILE_ICON_PROTOCOL_SCHEME, (request, callback) => {
    void getNativeFileIcon(request.url)
      .then((pngBuffer) => {
        callback({
          data: pngBuffer,
          mimeType: 'image/png',
          headers: {
            'cache-control': 'max-age=3600', // cache for 1 hour
          },
        });
      })
      .catch(() => {
        callback({
          error: -2, // "A generic failure occurred." from https://source.chromium.org/chromium/chromium/src/+/master:net/base/net_error_list.h;l=32
        });
      });
  });
}

async function getNativeFileIcon(url: string): Promise<Buffer> {
  const fsPath = url.substring(`${NATIVE_FILE_ICON_PROTOCOL_SCHEME}:///`.length);
  const icon = await app.getFileIcon(fsPath, { size: 'large' });
  return icon.toPNG();
}
