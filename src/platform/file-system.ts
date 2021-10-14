import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import { normalize } from 'code-oss-file-service/out/vs/base/common/path';
import { IFileService, IFileStat } from 'code-oss-file-service/out/vs/platform/files/common/files';

import { File, FILE_TYPE } from '@app/domain/types';
import { arrays } from '@app/base/utils/arrays.util';

export type PlatformFileSystem = Pick<
  IFileService,
  'resolve' | 'del' | 'copy' | 'move' | 'createFolder'
>;

export const createFileSystem = () => {
  const instance: PlatformFileSystem = {
    resolve: window.preload.fileService.resolve.bind(window.preload.fileService),
    del: async (resource, options) => {
      if (options?.useTrash) {
        // handle trash operation specifically via IPC because of https://github.com/electron/electron/issues/29598
        return await window.preload.shellTrashItem(normalize(resource.fsPath));
      } else {
        return await window.preload.fileService.del(resource, options);
      }
    },
    copy: window.preload.fileService.copy.bind(window.preload.fileService),
    move: window.preload.fileService.move.bind(window.preload.fileService),
    createFolder: window.preload.fileService.createFolder.bind(window.preload.fileService),
  };

  return instance;
};

export function mapFileStatToFile(file: IFileStat): File {
  const fileType = file.isDirectory
    ? FILE_TYPE.DIRECTORY
    : file.isSymbolicLink
    ? FILE_TYPE.SYMBOLIC_LINK
    : file.isFile
    ? FILE_TYPE.FILE
    : FILE_TYPE.UNKNOWN;

  return {
    id: file.resource.toString(),
    fileType,
    uri: file.resource.toJSON(),
    size: file.size,
    mtime: file.mtime,
    ctime: file.ctime,
  };
}

export function getDistinctParents(files: UriComponents[]): UriComponents[] {
  return arrays.uniqueValues(
    files.map((file) => URI.joinPath(URI.from(file), '..')),
    (item) => item.toString(),
  );
}

export async function fetchFiles(
  fileSystem: PlatformFileSystem,
  directory: UriComponents,
  resolveMetadata: boolean,
): Promise<File[]> {
  const statsWithMetadata = await fileSystem.resolve(URI.from(directory), { resolveMetadata });

  if (!statsWithMetadata.children) {
    return [];
  }
  return statsWithMetadata.children.map(mapFileStatToFile);
}
