import { VSBuffer } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/buffer';
import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IStat } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';
import { FileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/fileService';
import { InMemoryFileSystemProvider } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/inMemoryFilesystemProvider';
import {
  ConsoleMainLogger,
  LogService,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';
import dayjs from 'dayjs';

import { assertIsUnreachable } from '@app/base/utils/assert.util';
import { Writeable } from '@app/base/utils/types.util';
import { RESOURCE_TYPE } from '@app/domain/types';
import type { PlatformFileSystem } from '@app/platform/file-system.types';

type WritableIStat = Writeable<IStat>;

export type FileSystemResourceToCreate = {
  uri: URI;
  type: RESOURCE_TYPE.FILE | RESOURCE_TYPE.DIRECTORY;
  mtimeIso8601?: string;
};

export type CreateFakeFileSystemArgs = {
  resourcesToCreate?: FileSystemResourceToCreate[];
};

export const createFakeFileSystem: (
  args?: CreateFakeFileSystemArgs,
) => Promise<PlatformFileSystem> = async (args) => {
  const resourcesToCreate = args?.resourcesToCreate ?? defaultFileSystemResources;

  const logger = new ConsoleMainLogger();
  const logService = new LogService(logger);
  const fileService = new FileService(logService);
  const inMemoryFileSystemProvider = new InMemoryFileSystemProvider();
  fileService.registerProvider(Schemas.inMemory, inMemoryFileSystemProvider);

  async function createResource({ type, uri, mtimeIso8601 }: FileSystemResourceToCreate) {
    if (type === RESOURCE_TYPE.DIRECTORY) {
      await fileService.createFolder(uri);
    } else if (type === RESOURCE_TYPE.FILE) {
      await fileService.createFile(uri, VSBuffer.fromString(`test content of ${uri.toString()}`));
    } else {
      assertIsUnreachable(type);
    }

    if (mtimeIso8601 !== undefined) {
      const folderStat2 = await inMemoryFileSystemProvider.stat(uri);
      (folderStat2 as WritableIStat).mtime = dayjs(mtimeIso8601).unix() * 1000;
    }
  }

  await Promise.all(resourcesToCreate.map(createResource));

  return {
    resolve: fileService.resolve.bind(fileService),
    copy: fileService.copy.bind(fileService),
    move: fileService.move.bind(fileService),
    createFolder: fileService.createFolder.bind(fileService),
    del: fileService.del.bind(fileService),
    watch: fileService.watch.bind(fileService),
    onDidFilesChange: fileService.onDidFilesChange.bind(fileService),
  };
};

const defaultFileSystemResources: FileSystemResourceToCreate[] = [
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/aa test folder`),
    mtimeIso8601: '2021-05-08T19:01:59.789Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/zz test folder`),
    mtimeIso8601: '2021-05-08T01:05:15.012Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/test folder`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/test-folder`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/testfile1.txt`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/testfile2.docx`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/testfile3.pdf`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: URI.parse(
      `${Schemas.inMemory}:///home/testdir/zz test folder/zz test folder sub directory`,
    ),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: URI.parse(
      `${Schemas.inMemory}:///home/testdir/zz test folder/zz test folder sub directory/testfile1.txt`,
    ),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
];
