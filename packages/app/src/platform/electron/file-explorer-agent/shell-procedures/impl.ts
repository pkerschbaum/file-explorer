import { shell } from 'electron';
import { z } from 'zod';

import { path } from '#pkg/base/path';
import { URI, UriComponents } from '#pkg/base/uri';
import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

export function createShellProcedures() {
  return {
    trash: publicProcedure
      .input(z.object({ resource: UriComponents }))
      .mutation(async ({ input }) => {
        await shell.trashItem(path.normalize(URI.fsPath(input.resource)));
      }),
  };
}
