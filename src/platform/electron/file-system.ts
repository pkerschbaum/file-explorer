import { normalize } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import type {
  PlatformFileSystem,
  PlatformFileSystemURIInstances,
} from '@app/platform/file-system.types';

export const createFileSystem = () => {
  const instance: PlatformFileSystemURIInstances = {
    resolve: window.privileged.fileService.resolve.bind(window.privileged.fileService),
    del: window.privileged.fileService.del.bind(window.privileged.fileService),
    trash: async (resource) => {
      // handle trash operation via IPC because of https://github.com/electron/electron/issues/29598
      return await window.privileged.shell.trashItem({ fsPath: normalize(resource.fsPath) });
    },
    copy: window.privileged.fileService.copy.bind(window.privileged.fileService),
    move: window.privileged.fileService.move.bind(window.privileged.fileService),
    createFolder: window.privileged.fileService.createFolder.bind(window.privileged.fileService),
    watch: window.privileged.fileService.watch.bind(window.privileged.fileService),
    onDidFilesChange: window.privileged.fileService.onDidFilesChange.bind(
      window.privileged.fileService,
    ),
  };

  return convertUriComponentsToURIInstances(instance);
};

export function convertUriComponentsToURIInstances(
  origFileSystem: PlatformFileSystemURIInstances,
): PlatformFileSystem {
  const wrappedInstance: PlatformFileSystem = {
    async resolve(resource, options?) {
      return origFileSystem.resolve(URI.from(resource), options) as Promise<IFileStatWithMetadata>;
    },
    async del(resource, options?) {
      return origFileSystem.del(URI.from(resource), options);
    },
    async trash(resource, options?) {
      return origFileSystem.trash(URI.from(resource), options);
    },
    async copy(source, target, overwrite?, coordinationArgs?) {
      return origFileSystem.copy(URI.from(source), URI.from(target), overwrite, coordinationArgs);
    },
    async move(source, target, overwrite?, coordinationArgs?) {
      return origFileSystem.move(URI.from(source), URI.from(target), overwrite, coordinationArgs);
    },
    async createFolder(resource) {
      return origFileSystem.createFolder(URI.from(resource));
    },
    watch(resource, options = { recursive: false, excludes: [] }) {
      return origFileSystem.watch(URI.from(resource), options);
    },
    onDidFilesChange: origFileSystem.onDidFilesChange.bind(origFileSystem),
  };

  return wrappedInstance;
}
