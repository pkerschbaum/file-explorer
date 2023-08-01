import invariant from 'tiny-invariant';
import { z } from 'zod';

import { CancellationTokenSource } from '#pkg/base/cancellation';
import { fileServiceUriInstancesToComponents } from '#pkg/base/fileService';
import type { ReportProgressArgs } from '#pkg/base/resources';
import { schema_uriComponents } from '#pkg/base/uri';
import { bootstrapDiskFileService } from '#pkg/platform/electron/electron-preload/bootstrap-disk-file-service';
import type { PushServer } from '#pkg/platform/electron/file-explorer-agent/push-server';
import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

declare global {
  namespace PushServer {
    interface PushEventMap {
      CopyOperationReportProgress: {
        operationId: string;
        progress: ReportProgressArgs;
      };
    }
  }
}

export function createFsProcedures({ pushServer }: { pushServer: PushServer }) {
  const fileService = fileServiceUriInstancesToComponents(bootstrapDiskFileService());

  const fsOperationCancellationTokenSources: Map<
    /* operationId */ string,
    CancellationTokenSource
  > = new Map();

  return {
    fileServiceDispatchCopy: publicProcedure
      .input(
        z.object({
          operationId: z.string(),
          source: schema_uriComponents,
          target: schema_uriComponents,
          overwrite: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const cancellationTokenSource = new CancellationTokenSource();
        fsOperationCancellationTokenSources.set(input.operationId, cancellationTokenSource);
        return await fileService.copy(input.source, input.target, input.overwrite, {
          token: cancellationTokenSource.token,
          reportProgress: (args) => {
            pushServer.pushEvent({
              type: 'CopyOperationReportProgress',
              payload: { operationId: input.operationId, progress: args },
            });
          },
        });
      }),
    fileServiceCancelFsOperation: publicProcedure.input(z.string()).mutation(({ input }) => {
      const cancellationTokenSource = fsOperationCancellationTokenSources.get(input);
      invariant(cancellationTokenSource, `could not find element! id=${input}`);
      fsOperationCancellationTokenSources.delete(input);
      cancellationTokenSource.cancel();
    }),
  };
}
