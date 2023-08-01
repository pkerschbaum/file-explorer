import { path } from '#pkg/base/path';
import { URI } from '#pkg/base/uri';
import type { PlatformFileSystem } from '#pkg/platform/file-system.types';

export const createFileSystem = () => {
  const instance: PlatformFileSystem = {
    resolve: window.privileged.fileService.resolve.bind(window.privileged.fileService),
    del: window.privileged.fileService.del.bind(window.privileged.fileService),
    trash: async (resource) => {
      // handle trash operation via IPC because of https://github.com/electron/electron/issues/29598
      return await window.privileged.shell.trashItem({
        fsPath: path.normalize(URI.fsPath(resource)),
      });
    },
    copy: window.privileged.fileService.copy.bind(window.privileged.fileService),
    move: window.privileged.fileService.move.bind(window.privileged.fileService),
    createFolder: window.privileged.fileService.createFolder.bind(window.privileged.fileService),
    watch: window.privileged.fileService.watch.bind(window.privileged.fileService),
    onDidFilesChange: window.privileged.fileService.onDidFilesChange.bind(
      window.privileged.fileService,
    ),
  };

  return instance;
};
