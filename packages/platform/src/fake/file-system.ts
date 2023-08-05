import dayjs from 'dayjs';

import { VSBuffer } from '@file-explorer/code-oss-ecma/buffer';
import type { IStat } from '@file-explorer/code-oss-ecma/files';
import { fileServiceUriInstancesToComponents } from '@file-explorer/code-oss-ecma/fileService';
import { bootstrapInMemoryFileService } from '@file-explorer/code-oss-ecma/in-memory-file-service';
import { network } from '@file-explorer/code-oss-ecma/network';
import { RESOURCE_TYPE } from '@file-explorer/code-oss-ecma/types';
import { URI, UriComponents } from '@file-explorer/code-oss-ecma/uri';
import { uriHelper } from '@file-explorer/code-oss-ecma/uri-helper';
import { assertIsUnreachable } from '@file-explorer/commons-ecma/util/assert.util';
import type { Writeable } from '@file-explorer/commons-ecma/util/types.util';

import type { PlatformFileSystem } from '#pkg/file-system.types';

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

  const { fileService: origFileService, inMemoryFileSystemProvider } =
    bootstrapInMemoryFileService();
  const fileService = fileServiceUriInstancesToComponents(origFileService);

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
    ...fileService,
    onResourceChanged(resource, onChange) {
      return fileService.onDidFilesChange((e) => {
        if (e.affects(resource)) {
          onChange();
        }
      });
    },
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
