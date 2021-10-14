import { URI } from 'code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from 'code-oss-file-service/out/vs/platform/files/common/files';

import { PlatformFileSystem } from '@app/platform/file-system';

const fakeFileStat: IFileStatWithMetadata = {
  isDirectory: false,
  isFile: true,
  isSymbolicLink: false,
  name: 'test-file.txt',
  resource: URI.file('/home/dir/test-file.txt'),
  ctime: Date.now(),
  mtime: Date.now(),
  readonly: false,
  size: 1024,
  etag: '',
};

export const fakeFileSystem: PlatformFileSystem = {
  resolve: () => Promise.resolve(fakeFileStat),
  copy: () => Promise.resolve(fakeFileStat),
  move: () => Promise.resolve(fakeFileStat),
  createFolder: () => Promise.resolve(fakeFileStat),
  del: () => Promise.resolve(),
};
