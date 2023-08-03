import { shell } from 'electron';
import { z } from 'zod';

import { path } from '#pkg/base/path';
import { URI, UriComponents } from '#pkg/base/uri';
import { check } from '#pkg/base/utils/assert.util';
import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

export function createShellProcedures() {
  return {
    openPath: publicProcedure
      .input(z.object({ resource: UriComponents }))
      .mutation(async ({ input }) => {
        const errorMessage = await shell.openPath(path.normalize(URI.fsPath(input.resource)));
        if (check.isNonEmptyString(errorMessage)) {
          throw new Error(`Could not open path, reason: ${errorMessage}`);
        }
      }),

    showItemInFolder: publicProcedure
      .input(z.object({ resource: UriComponents }))
      .mutation(({ input }) => {
        shell.showItemInFolder(path.normalize(URI.fsPath(input.resource)));
      }),

    trash: publicProcedure
      .input(z.object({ resource: UriComponents }))
      .mutation(async ({ input }) => {
        await shell.trashItem(path.normalize(URI.fsPath(input.resource)));
      }),
  };
}
