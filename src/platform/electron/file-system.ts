import { CancellationToken } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import { IDisposable } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/lifecycle';
import { normalize } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { ProgressCbArgs } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import {
  IResolveFileOptions,
  IFileStat,
  FileDeleteOptions,
  IFileStatWithMetadata,
  IWatchOptions,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import type {
  PlatformFileSystem,
  PlatformFileSystemURIInstances,
} from '@app/platform/file-system.types';

export const createFileSystem = () => {
  const instance: PlatformFileSystemURIInstances = {
    resolve: window.privileged.fileService.resolve.bind(window.privileged.fileService),
    del: async (resource, options) => {
      if (options?.useTrash) {
        // handle trash operation specifically via IPC because of https://github.com/electron/electron/issues/29598
        return await window.privileged.shell.trashItem({ fsPath: normalize(resource.fsPath) });
      } else {
        return await window.privileged.fileService.del(resource, options);
      }
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
    async resolve(resource: UriComponents, options?: IResolveFileOptions): Promise<IFileStat> {
      return origFileSystem.resolve(URI.from(resource), options);
    },
    async del(resource: UriComponents, options?: Partial<FileDeleteOptions>): Promise<void> {
      return origFileSystem.del(URI.from(resource), options);
    },
    async copy(
      source: UriComponents,
      target: UriComponents,
      overwrite?: boolean,
      additionalArgs?: { token?: CancellationToken; progressCb?: (args: ProgressCbArgs) => void },
    ): Promise<undefined | IFileStatWithMetadata> {
      return origFileSystem.copy(URI.from(source), URI.from(target), overwrite, additionalArgs);
    },
    async move(
      source: UriComponents,
      target: UriComponents,
      overwrite?: boolean,
      additionalArgs?: { token?: CancellationToken; progressCb?: (args: ProgressCbArgs) => void },
    ): Promise<undefined | IFileStatWithMetadata> {
      return origFileSystem.move(URI.from(source), URI.from(target), overwrite, additionalArgs);
    },
    async createFolder(resource: UriComponents): Promise<IFileStatWithMetadata> {
      return origFileSystem.createFolder(URI.from(resource));
    },
    watch(
      resource: UriComponents,
      options: IWatchOptions = { recursive: false, excludes: [] },
    ): IDisposable {
      return origFileSystem.watch(URI.from(resource), options);
    },
    onDidFilesChange: origFileSystem.onDidFilesChange.bind(origFileSystem),
  };

  return wrappedInstance;
}
