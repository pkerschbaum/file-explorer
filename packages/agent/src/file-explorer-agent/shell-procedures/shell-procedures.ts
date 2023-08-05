import { shell } from 'electron';
import { z } from 'zod';

import { path } from '@file-explorer/code-oss-ecma/path';
import { URI, UriComponents } from '@file-explorer/code-oss-ecma/uri';
import { check } from '@file-explorer/commons-ecma/util/assert.util';

import { publicProcedure } from '#pkg/file-explorer-agent/trcp-router';

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
