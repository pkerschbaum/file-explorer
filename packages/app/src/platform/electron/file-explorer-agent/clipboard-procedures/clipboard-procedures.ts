import { clipboard } from 'electron';
import { z } from 'zod';

import { VSBuffer } from '#pkg/base/buffer';
import { URI, UriComponents } from '#pkg/base/uri';
import { config } from '#pkg/config';
import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

const CLIPBOARD_FILELIST_FORMAT = `${config.productName}/file-list`;

export function createClipboardProcedures() {
  return {
    readText: publicProcedure.query(() => clipboard.readText()),

    writeText: publicProcedure.input(z.object({ value: z.string() })).mutation(({ input }) => {
      clipboard.writeText(input.value);
    }),

    readResources: publicProcedure.query(() =>
      bufferToResources(clipboard.readBuffer(CLIPBOARD_FILELIST_FORMAT)),
    ),

    writeResources: publicProcedure
      .input(z.object({ resources: z.array(UriComponents) }))
      .mutation(({ input }) => {
        clipboard.writeBuffer(
          CLIPBOARD_FILELIST_FORMAT,
          Buffer.from(resourcesToBuffer(input.resources)),
          undefined,
        );
      }),
  };
}

function bufferToResources(buffer: Uint8Array): UriComponents[] {
  if (!buffer) {
    return [];
  }

  const bufferValue = VSBuffer.wrap(buffer).toString();
  if (!bufferValue) {
    return [];
  }

  try {
    return bufferValue.split('\n').map((f) => URI.parse(f));
  } catch {
    return []; // do not trust clipboard data
  }
}

function resourcesToBuffer(resources: UriComponents[]): Uint8Array {
  return VSBuffer.fromString(resources.map((r) => URI.toString(r)).join('\n')).buffer;
}
