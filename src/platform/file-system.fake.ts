import { VSBuffer } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/buffer';
import { Schemas } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/network';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { FileService } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/fileService';
import { InMemoryFileSystemProvider } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/inMemoryFilesystemProvider';
import {
  ConsoleMainLogger,
  LogService,
} from '@pkerschbaum/code-oss-file-service/out/vs/platform/log/common/log';

import { PlatformFileSystem } from '@app/platform/file-system';

export const createFakeFileSystem: () => Promise<PlatformFileSystem> = async () => {
  const logger = new ConsoleMainLogger();
  const logService = new LogService(logger);
  const fileService = new FileService(logService);
  const inMemoryFileSystemProvider = new InMemoryFileSystemProvider();
  fileService.registerProvider(Schemas.inMemory, inMemoryFileSystemProvider);

  await fileService.createFolder(URI.parse(`${Schemas.inMemory}:///`));
  await fileService.createFolder(URI.parse(`${Schemas.inMemory}:///home/`));
  await fileService.createFolder(URI.parse(`${Schemas.inMemory}:///home/testdir`));
  await fileService.createFolder(URI.parse(`${Schemas.inMemory}:///home/testdir/test-folder`));
  await fileService.createFile(
    URI.parse(`${Schemas.inMemory}:///home/testdir/testfile1.txt`),
    VSBuffer.fromString('test content of testfile1.txt'),
  );
  await fileService.createFile(
    URI.parse(`${Schemas.inMemory}:///home/testdir/testfile2.docx`),
    VSBuffer.fromString('test content of testfile2.docx'),
  );
  await fileService.createFile(
    URI.parse(`${Schemas.inMemory}:///home/testdir/testfile3.pdf`),
    VSBuffer.fromString('test content of testfile3.pdf'),
  );

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
