import invariant from 'tiny-invariant';
import { z } from 'zod';

import { CancellationTokenSource } from '#pkg/base/cancellation';
import {
  FileDeleteOptionsWithoutTrash,
  IResolveFileOptions,
  IResolveMetadataFileOptions,
  IWatchOptions,
} from '#pkg/base/files';
import { fileServiceUriInstancesToComponents } from '#pkg/base/fileService';
import type { ReportProgressArgs } from '#pkg/base/resources';
import { UriComponents } from '#pkg/base/uri';
import { assertIsUnreachable } from '#pkg/base/utils/assert.util';
import { bootstrapDiskFileService } from '#pkg/platform/electron/file-explorer-agent/disk-file-service';
import type { PushServer } from '#pkg/platform/electron/file-explorer-agent/push-server';
import { publicProcedure } from '#pkg/platform/electron/file-explorer-agent/trcp-router';

declare global {
  namespace PushServer {
    interface PushEventMap {
      ResourceChanged: {
        operationId: string;
      };

      CopyOrMoveOperationReportProgress: {
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
    cancelFsOperation: publicProcedure
      .input(z.object({ operationId: z.string() }))
      .mutation(({ input }) => {
        const cancellationTokenSource = fsOperationCancellationTokenSources.get(input.operationId);
        invariant(
          cancellationTokenSource,
          `could not find element! operationId=${input.operationId}`,
        );
        fsOperationCancellationTokenSources.delete(input.operationId);
        cancellationTokenSource.cancel();
      }),

    resolve: publicProcedure
      .input(
        z.object({
          resource: UriComponents,
          options: IResolveFileOptions.optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return await fileService.resolve(input.resource, input.options);
      }),

    resolveWithMetadata: publicProcedure
      .input(
        z.object({
          resource: UriComponents,
          options: IResolveMetadataFileOptions,
        }),
      )
      .mutation(async ({ input }) => {
        return await fileService.resolve(input.resource, input.options);
      }),

    del: publicProcedure
      .input(
        z.object({
          resource: UriComponents,
          options: FileDeleteOptionsWithoutTrash.optional(),
        }),
      )
      .mutation(async ({ input }) => {
        return await fileService.del(input.resource, input.options);
      }),

    dispatchCopyOrMove: publicProcedure
      .input(
        z.object({
          copyOrMove: z.enum(['copy', 'move']),
          operationId: z.string(),
          source: UriComponents,
          target: UriComponents,
          overwrite: z.boolean().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const cancellationTokenSource = new CancellationTokenSource();
        fsOperationCancellationTokenSources.set(input.operationId, cancellationTokenSource);

        let fn;
        switch (input.copyOrMove) {
          case 'copy': {
            fn = fileService.copy.bind(fileService);
            break;
          }
          case 'move': {
            fn = fileService.move.bind(fileService);
            break;
          }
          default: {
            assertIsUnreachable(input.copyOrMove);
          }
        }

        return await fn(input.source, input.target, input.overwrite, {
          token: cancellationTokenSource.token,
          reportProgress: (args) => {
            pushServer.pushEvent({
              type: 'CopyOrMoveOperationReportProgress',
              payload: { operationId: input.operationId, progress: args },
            });
          },
        });
      }),

    createFolder: publicProcedure
      .input(
        z.object({
          resource: UriComponents,
        }),
      )
      .mutation(async ({ input }) => {
        return await fileService.createFolder(input.resource);
      }),

    watch: publicProcedure
      .input(
        z.object({
          operationId: z.string(),
          resource: UriComponents,
          options: IWatchOptions.optional(),
        }),
      )
      .mutation(({ input }) => {
        const disposable = fileService.watch(input.resource, input.options);

        const cancellationTokenSource = new CancellationTokenSource();
        fsOperationCancellationTokenSources.set(input.operationId, cancellationTokenSource);
        cancellationTokenSource.token.onCancellationRequested(() => {
          disposable.dispose();
        });
      }),

    onResourceChanged: publicProcedure
      .input(
        z.object({
          operationId: z.string(),
          resource: UriComponents,
        }),
      )
      .mutation(({ input }) => {
        const cancellationTokenSource = new CancellationTokenSource();
        fsOperationCancellationTokenSources.set(input.operationId, cancellationTokenSource);

        const onDidFilesChangeDisposable = fileService.onDidFilesChange((e) => {
          if (e.affects(input.resource)) {
            pushServer.pushEvent({
              type: 'ResourceChanged',
              payload: { operationId: input.operationId },
            });
          }
        });
        cancellationTokenSource.token.onCancellationRequested(() => {
          onDidFilesChangeDisposable.dispose();
        });
      }),
  };
}
