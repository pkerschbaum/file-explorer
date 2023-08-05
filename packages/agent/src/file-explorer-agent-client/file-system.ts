import invariant from 'tiny-invariant';

import type {
  IFileStatWithMetadata,
  IResolveMetadataFileOptions,
} from '@file-explorer/code-oss-ecma/files';
import type { CoordinationArgs } from '@file-explorer/code-oss-ecma/resources';
import type { PlatformFileSystem } from '@file-explorer/platform/file-system.types';

import { pushSocket, trpc } from '#pkg/file-explorer-agent-client/agent-client';
import { createLogger } from '#pkg/file-explorer-agent-client/create-logger';

const logger = createLogger('file-system');

export const createFileSystem = () => {
  pushSocket.on('CopyOrMoveOperationReportProgress', (payload) => {
    const reportProgress = operationIdToReportProgress.get(payload.operationId);
    if (reportProgress) {
      reportProgress(payload.progress);
    }
  });

  pushSocket.on('ResourceChanged', (payload) => {
    const onChange = operationIdToOnResourceChanged.get(payload.operationId);
    invariant(onChange, `expected to find element! operationId=${payload.operationId}`);
    onChange();
  });

  // TODO remove elems from `operationIdToReportProgress` when copy/move operation gets finished or aborted
  const operationIdToReportProgress = new Map<
    /* operationId */ string,
    Exclude<CoordinationArgs['reportProgress'], undefined>
  >();
  const operationIdToOnResourceChanged = new Map</* operationId */ string, () => void>();

  const copyOrMove: (
    copyOrMove: 'copy' | 'move',
  ) => PlatformFileSystem['copy'] | PlatformFileSystem['move'] =
    (copyOrMove) => async (source, target, overwrite, coordinationArgs) => {
      const operationId = crypto.randomUUID();

      if (coordinationArgs?.reportProgress) {
        operationIdToReportProgress.set(operationId, coordinationArgs.reportProgress);
      }
      if (coordinationArgs?.token) {
        coordinationArgs.token.onCancellationRequested(async () => {
          await trpc.fs.cancelFsOperation.mutate({ operationId });
        });
      }

      const result = await trpc.fs.dispatchCopyOrMove.mutate({
        copyOrMove,
        operationId,
        source,
        target,
        overwrite,
      });
      return result;
    };

  const instance: PlatformFileSystem = {
    async resolve(resource, options) {
      if (options?.resolveMetadata) {
        return await trpc.fs.resolveWithMetadata.mutate({
          resource,
          options: options as IResolveMetadataFileOptions,
        });
      } else {
        return (await trpc.fs.resolve.mutate({
          resource,
          options,
        })) as IFileStatWithMetadata;
      }
    },

    async del(resource, options) {
      return await trpc.fs.del.mutate({ resource, options });
    },

    async trash(resource) {
      return await trpc.shell.trash.mutate({ resource });
    },

    copy: copyOrMove('copy'),

    move: copyOrMove('move'),

    async createFolder(resource) {
      return await trpc.fs.createFolder.mutate({ resource });
    },

    async watch(resource, options) {
      const operationId = crypto.randomUUID();
      await trpc.fs.watch.mutate({ operationId, resource, options });

      return {
        dispose: () => {
          trpc.fs.cancelFsOperation.mutate({ operationId }).catch((error) => {
            logger.error(`could not cancel FS operation`, error);
          });
        },
      };
    },

    async onResourceChanged(resource, onChange) {
      const operationId = crypto.randomUUID();
      operationIdToOnResourceChanged.set(operationId, onChange);
      await trpc.fs.onResourceChanged.mutate({ operationId, resource });

      return {
        dispose() {
          operationIdToOnResourceChanged.delete(operationId);
          trpc.fs.cancelFsOperation.mutate({ operationId }).catch((error) => {
            logger.error(`could not cancel FS operation`, error);
          });
        },
      };
    },
  };

  return instance;
};
