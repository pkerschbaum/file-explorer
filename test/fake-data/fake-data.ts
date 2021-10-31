import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import { URI } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

import {
  DELETE_PROCESS_STATUS,
  PasteProcessBase,
  AppProcess,
  PROCESS_TYPE,
  PASTE_PROCESS_STATUS,
  DeleteProcessBase,
} from '@app/domain/types';

export const fakeFileStat: IFileStatWithMetadata = {
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

export const fakePasteProcessBase: PasteProcessBase = {
  id: 'fake-paste-process-id',
  type: PROCESS_TYPE.PASTE,
  pasteShouldMove: false,
  sourceUris: [
    fakeFileStat.resource,
    URI.joinPath(fakeFileStat.resource, './testfile2.docx'),
    URI.joinPath(fakeFileStat.resource, './testfile3.pdf'),
  ],
  destinationFolder: URI.file('/home/dir/'),
  cancellationTokenSource: new CancellationTokenSource(),
  totalSize: 1024 * 1024 * 10, // 10MB
  bytesProcessed: 1024 * 1024 * 2, // 2MB
  progressOfAtLeastOneSourceIsIndeterminate: false,
};

export const fakePasteProcess: AppProcess = {
  ...fakePasteProcessBase,
  status: PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE,
};

export const fakeDeleteProcessBase: DeleteProcessBase = {
  id: 'fake-delete-process-id',
  type: PROCESS_TYPE.DELETE,
  uris: [
    fakeFileStat.resource,
    URI.joinPath(fakeFileStat.resource, './testfile2.docx'),
    URI.joinPath(fakeFileStat.resource, './testfile3.pdf'),
  ],
};

export const fakeDeleteProcess: AppProcess = {
  ...fakeDeleteProcessBase,
  status: DELETE_PROCESS_STATUS.RUNNING,
};
