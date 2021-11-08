import { normalize } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/path';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import {
  IFileService,
  IFileStat,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import { arrays } from '@app/base/utils/arrays.util';
import { uriHelper } from '@app/base/utils/uri-helper';
import { Resource, RESOURCE_TYPE } from '@app/domain/types';

export type PlatformFileSystem = {
  resolve: IFileService['resolve'];
  del: IFileService['del'];
  copy: IFileService['copy'];
  move: IFileService['move'];
  createFolder: IFileService['createFolder'];
  watch: IFileService['watch'];
  onDidFilesChange: IFileService['onDidFilesChange'];
};

export const createFileSystem = () => {
  const instance: PlatformFileSystem = {
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

  return instance;
};

export function mapFileStatToResource(resource: IFileStat): Resource {
  const resourceType = resource.isDirectory
    ? RESOURCE_TYPE.DIRECTORY
    : resource.isSymbolicLink
    ? RESOURCE_TYPE.SYMBOLIC_LINK
    : resource.isFile
    ? RESOURCE_TYPE.FILE
    : RESOURCE_TYPE.UNKNOWN;

  return {
    key: uriHelper.getComparisonKey(resource.resource),
    resourceType,
    uri: resource.resource.toJSON(),
    size: resource.size,
    mtime: resource.mtime,
    ctime: resource.ctime,
  };
}

export function getDistinctParents(resources: UriComponents[]): UriComponents[] {
  return arrays.uniqueValues(
    resources.map((resource) => URI.joinPath(URI.from(resource), '..')),
    (resource) => uriHelper.getComparisonKey(resource),
  );
}

export async function fetchResources(
  fileSystem: PlatformFileSystem,
  {
    directory,
    resolveMetadata,
  }: {
    directory: UriComponents;
    resolveMetadata: boolean;
  },
): Promise<Resource[]> {
  const statsWithMetadata = await fileSystem.resolve(URI.from(directory), { resolveMetadata });

  if (!statsWithMetadata.children) {
    return [];
  }
  return statsWithMetadata.children.map(mapFileStatToResource);
}
