import { URI, UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import { IFileService, IFileStat } from 'code-oss-file-service/out/vs/platform/files/common/files';

import { File, FILE_TYPE } from '@app/platform/file-types';
import { arrays } from '@app/base/utils/arrays.util';

export type NexFileSystem = Pick<
  IFileService,
  'resolve' | 'del' | 'copy' | 'move' | 'createFolder'
> & {
  revealResourcesInOS(resources: UriComponents[]): void;
};

export class NexFileSystemImpl implements NexFileSystem {
  public resolve = window.preload.fileService.resolve.bind(window.preload.fileService);
  public del = window.preload.fileService.del.bind(window.preload.fileService);
  public copy = window.preload.fileService.copy.bind(window.preload.fileService);
  public move = window.preload.fileService.move.bind(window.preload.fileService);
  public createFolder = window.preload.fileService.createFolder.bind(window.preload.fileService);

  public revealResourcesInOS = window.preload.revealResourcesInOS;
}

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
