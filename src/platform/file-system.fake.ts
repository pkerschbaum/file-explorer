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

  const uriOfFolder1 = URI.parse(`${Schemas.inMemory}:///home/testdir/test-folder`);
  await fileService.createFolder(uriOfFolder1);
  const folderStat1 = await inMemoryFileSystemProvider.stat(uriOfFolder1);
  (folderStat1 as WritableIStat).mtime = dayjs('2021-05-08T18:59:01.456Z').unix() * 1000;

  const uriOfFile1 = URI.parse(`${Schemas.inMemory}:///home/testdir/testfile1.txt`);
  await fileService.createFile(uriOfFile1, VSBuffer.fromString('test content of testfile1.txt'));
  const fileStat1 = await inMemoryFileSystemProvider.stat(uriOfFile1);
  (fileStat1 as WritableIStat).mtime = dayjs('2021-05-08T18:59:01.456Z').unix() * 1000;

  const uriOfFile2 = URI.parse(`${Schemas.inMemory}:///home/testdir/testfile2.docx`);
  await fileService.createFile(uriOfFile2, VSBuffer.fromString('test content of testfile2.docx'));
  const fileStat2 = await inMemoryFileSystemProvider.stat(uriOfFile2);
  (fileStat2 as WritableIStat).mtime = dayjs('2021-05-08T18:59:01.456Z').unix() * 1000;

  const uriOfFile3 = URI.parse(`${Schemas.inMemory}:///home/testdir/testfile3.pdf`);
  await fileService.createFile(uriOfFile3, VSBuffer.fromString('test content of testfile3.pdf'));
  const fileStat3 = await inMemoryFileSystemProvider.stat(uriOfFile3);
  (fileStat3 as WritableIStat).mtime = dayjs('2021-05-08T18:59:01.456Z').unix() * 1000;

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
