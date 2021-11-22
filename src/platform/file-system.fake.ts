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

import { Writeable } from '@app/base/utils/types.util';
import { PlatformFileSystem } from '@app/platform/file-system';

type WritableIStat = Writeable<IStat>;

export const createFakeFileSystem: () => Promise<PlatformFileSystem> = async () => {
  const logger = new ConsoleMainLogger();
  const logService = new LogService(logger);
  const fileService = new FileService(logService);
  const inMemoryFileSystemProvider = new InMemoryFileSystemProvider();
  fileService.registerProvider(Schemas.inMemory, inMemoryFileSystemProvider);

  async function createFolder({ uri, mtimeIso8601 }: { uri: URI; mtimeIso8601: string }) {
    await fileService.createFolder(uri);
    const folderStat2 = await inMemoryFileSystemProvider.stat(uri);
    (folderStat2 as WritableIStat).mtime = dayjs(mtimeIso8601).unix() * 1000;
  }
  async function createFile({ uri, mtimeIso8601 }: { uri: URI; mtimeIso8601: string }) {
    await fileService.createFile(uri, VSBuffer.fromString(`test content of ${uri.toString()}`));
    const fileStat1 = await inMemoryFileSystemProvider.stat(uri);
    (fileStat1 as WritableIStat).mtime = dayjs(mtimeIso8601).unix() * 1000;
  }

  await createFolder({
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/aa test folder`),
    mtimeIso8601: '2021-05-08T19:01:59.789Z',
  });
  await createFolder({
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/zz test folder`),
    mtimeIso8601: '2021-05-08T01:05:15.012Z',
  });
  await createFolder({
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/test folder`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  });
  await createFolder({
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/test-folder`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  });
  await createFile({
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/testfile1.txt`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  });
  await createFile({
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/testfile2.docx`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  });
  await createFile({
    uri: URI.parse(`${Schemas.inMemory}:///home/testdir/testfile3.pdf`),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  });
  await createFolder({
    uri: URI.parse(
      `${Schemas.inMemory}:///home/testdir/zz test folder/zz test folder sub directory`,
    ),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  });
  await createFile({
    uri: URI.parse(
      `${Schemas.inMemory}:///home/testdir/zz test folder/zz test folder sub directory/testfile1.txt`,
    ),
    mtimeIso8601: '2021-05-08T18:59:01.456Z',
  });

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
