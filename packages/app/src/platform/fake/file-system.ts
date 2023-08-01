import {
  ConsoleMainLogger,
  LogService,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';
import dayjs from 'dayjs';

import { VSBuffer } from '#pkg/base/buffer';
import type { IStat } from '#pkg/base/files';
import { FileService, fileServiceUriInstancesToComponents } from '#pkg/base/fileService';
import { InMemoryFileSystemProvider } from '#pkg/base/inMemoryFilesystemProvider';
import { network } from '#pkg/base/network';
import { URI, UriComponents } from '#pkg/base/uri';
import { assertIsUnreachable } from '#pkg/base/utils/assert.util';
import type { Writeable } from '#pkg/base/utils/types.util';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import { RESOURCE_TYPE } from '#pkg/domain/types';
import type { PlatformFileSystem } from '#pkg/platform/file-system.types';

type WritableIStat = Writeable<IStat>;

export type FileSystemResourceToCreate = {
  uri: UriComponents;
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
  fileService.registerProvider(network.Schemas.file, inMemoryFileSystemProvider);

  async function createResource({ type, uri, mtimeIso8601 }: FileSystemResourceToCreate) {
    if (type === RESOURCE_TYPE.DIRECTORY) {
      await fileService.createFolder(uri);
    } else if (type === RESOURCE_TYPE.FILE) {
      await fileService.createFile(
        uri,
        VSBuffer.fromString(`test content of ${URI.toString(uri)}`),
      );
    } else {
      assertIsUnreachable(type);
    }

    if (mtimeIso8601 !== undefined) {
      const folderStat2 = await inMemoryFileSystemProvider.stat(uri);
      (folderStat2 as WritableIStat).mtime = dayjs(mtimeIso8601).unix() * 1000;
    }
  }

  await Promise.all(resourcesToCreate.map(createResource));

  const instance: PlatformFileSystem = {
    ...fileServiceUriInstancesToComponents(fileService),
    trash: fileService.del.bind(fileService),
  };

  return instance;
};

const defaultFileSystemResources: FileSystemResourceToCreate[] = [
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir/aa test folder`),
    mtimeIso8601: '2021-05-08T19:01:59.789Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir/zz test folder`),
    mtimeIso8601: '2021-05-08T01:05:15.012Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir/test folder`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir/test-folder`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir/testfile1.txt`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir/testfile2.docx`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: uriHelper.parseUri(network.Schemas.file, `/home/testdir/testfile3.pdf`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.DIRECTORY,
    uri: uriHelper.parseUri(
      network.Schemas.file,
      `/home/testdir/zz test folder/zz test folder sub directory`,
    ),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
  {
    type: RESOURCE_TYPE.FILE,
    uri: uriHelper.parseUri(
      network.Schemas.file,
      `/home/testdir/zz test folder/zz test folder sub directory/testfile1.txt`,
    ),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  },
];
