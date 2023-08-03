import { app } from 'electron';
import { z } from 'zod';

import { network } from '#pkg/base/network';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

export function createAppProcedures() {
  return {
    getPath: publicProcedure.input(z.object({ name: z.enum(['home']) })).mutation(({ input }) => {
      return uriHelper.parseUri(network.Schemas.file, app.getPath(input.name));
    }),
  };
}
