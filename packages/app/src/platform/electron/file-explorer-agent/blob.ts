import { app } from 'electron';
import type express from 'express';
import FileType from 'file-type';
import mime from 'mime';
import fs from 'node:fs';
import sharp from 'sharp';
import invariant from 'tiny-invariant';

import { URI } from '#pkg/base/uri';
import { check } from '#pkg/base/utils/assert.util';
import { numbers } from '#pkg/base/utils/numbers.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import {
  AGENT_PORT,
  NATIVE_FILE_ICON_PATH,
  THUMBNAIL_PATH,
} from '#pkg/platform/electron/file-explorer-agent/constants';

export function registerRoutes(app: express.Express): void {
  app.use(THUMBNAIL_PATH, async (req, res) => {
    const thumbnail = await getThumbnail(req);

    res.setHeader('cache-control', `max-age=${60 * 60 * 24}`); // cache for 1 day
    if (thumbnail.mimeType) {
      res.setHeader('content-type', thumbnail.mimeType);
    }
    res.status(200);
    thumbnail.data.pipe(res);
  });

  app.use(NATIVE_FILE_ICON_PATH, async (req, res) => {
    const nativeFileIcon = await getNativeFileIcon(req);

    res.setHeader('cache-control', `max-age=${60 * 60}`); // cache for 1 hour
    res.setHeader('content-type', nativeFileIcon.mimeType);
    res.status(200);
    res.send(nativeFileIcon.data);
  });
}

// Skip resizing of SVGs (because vector images should just get served to the UI)
const THUMBNAIL_RESIZE_BLOCKLIST = new Set(['image/svg+xml']);
async function getThumbnail(req: express.Request) {
  const parsed = new URL(req.url, `http://localhost:${AGENT_PORT}`);
  const segments = parsed.pathname.split('/');
  const resourceSegment = segments.at(-1);
  invariant(resourceSegment);
  const uri = URI.parse(decodeURIComponent(resourceSegment));
  const requestedHeight = parsed.searchParams.get('height');
  const parsedHeight = numbers.convert(requestedHeight);
  invariant(parsedHeight !== undefined);

  const mimeTypeBasedOnContent = (await FileType.fromFile(URI.fsPath(uri)))?.mime;
  const extension = uriHelper.extractExtension(uri);
  const mimeTypeBasedOnExtension = check.isNullishOrEmptyString(extension)
    ? undefined
    : mime.getType(extension);
  const finalMimeType = mimeTypeBasedOnContent ?? mimeTypeBasedOnExtension ?? undefined;

  const thumbnailStream =
    finalMimeType === undefined || THUMBNAIL_RESIZE_BLOCKLIST.has(finalMimeType)
      ? fs.createReadStream(URI.fsPath(uri))
      : fs.createReadStream(URI.fsPath(uri)).pipe(
          sharp({
            // set animated to `true` to keep animated GIFs and WebPs
            animated: true,
          }).resize({ height: parsedHeight }),
        );

  return {
    data: thumbnailStream,
    mimeType: finalMimeType,
  };
}

async function getNativeFileIcon(req: express.Request) {
  const parsed = new URL(req.url, `http://localhost:${AGENT_PORT}`);
  const segments = parsed.pathname.split('/');
  const resourceSegment = segments.at(-1);
  invariant(resourceSegment);
  const uri = URI.parse(decodeURIComponent(resourceSegment));
  const icon = await app.getFileIcon(URI.fsPath(uri), { size: 'large' });

  return {
    data: icon.toPNG(),
    mimeType: 'image/png',
  };
}
