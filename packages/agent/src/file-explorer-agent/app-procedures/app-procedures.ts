import { app } from 'electron';
import { z } from 'zod';

import { network } from '@file-explorer/code-oss-ecma/network';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';

import { publicProcedure } from '#pkg/file-explorer-agent/trcp-router';

export function createAppProcedures() {
  return {
    getPath: publicProcedure.input(z.object({ name: z.enum(['home']) })).mutation(({ input }) => {
      return uriHelper.parseUri(network.Schemas.file, app.getPath(input.name));
    }),
  };
}
