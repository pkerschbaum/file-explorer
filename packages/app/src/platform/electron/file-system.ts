import invariant from 'tiny-invariant';

import { path } from '#pkg/base/path';
import type { CoordinationArgs } from '#pkg/base/resources';
import { URI } from '#pkg/base/uri';
import { PUSH_EVENT } from '#pkg/platform/electron/file-explorer-agent/constants';
import type { PushEvent } from '#pkg/platform/electron/file-explorer-agent/push-server';
import { pushSocket, trpc } from '#pkg/platform/electron/file-explorer-agent-client/file-system';
import type { PlatformFileSystem } from '#pkg/platform/file-system.types';

export const createFileSystem = () => {
  pushSocket.on(PUSH_EVENT, (event: PushEvent) => {
    const coordinationArgs = operationIdToCoordinationArgs.get(event.payload.operationId);
    invariant(
      coordinationArgs,
      `expected to find element! operationId=${event.payload.operationId}`,
    );
    invariant(coordinationArgs.reportProgress);
    coordinationArgs.reportProgress(event.payload.progress);
  });

  const operationIdToCoordinationArgs = new Map<string, CoordinationArgs>();

  const instance: PlatformFileSystem = {
    resolve: window.privileged.fileService.resolve.bind(window.privileged.fileService),
    del: window.privileged.fileService.del.bind(window.privileged.fileService),
    trash: async (resource) => {
      // handle trash operation via IPC because of https://github.com/electron/electron/issues/29598
      return await window.privileged.shell.trashItem({
        fsPath: path.normalize(URI.fsPath(resource)),
      });
    },
    copy: async (source, target, overwrite, coordinationArgs) => {
      invariant(coordinationArgs);
      invariant(coordinationArgs.token);
      const operationId = crypto.randomUUID();
      operationIdToCoordinationArgs.set(operationId, coordinationArgs);
      coordinationArgs.token.onCancellationRequested(async () => {
        await trpc.fileServiceCancelFsOperation.mutate(operationId);
      });
      const result = await trpc.fileServiceDispatchCopy.mutate({
        operationId,
        source,
        target,
        overwrite,
      });
      return result;
    },
    move: window.privileged.fileService.move.bind(window.privileged.fileService),
    createFolder: window.privileged.fileService.createFolder.bind(window.privileged.fileService),
    watch: window.privileged.fileService.watch.bind(window.privileged.fileService),
    onDidFilesChange: window.privileged.fileService.onDidFilesChange.bind(
      window.privileged.fileService,
    ),
  };

  return instance;
};
