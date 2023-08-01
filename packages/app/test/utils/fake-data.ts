import dayjs from 'dayjs';

import { CancellationTokenSource } from '#pkg/base/cancellation';
import type { IFileStatWithMetadata } from '#pkg/base/files';
import { network } from '#pkg/base/network';
import { URI } from '#pkg/base/uri';
import { uriHelper } from '#pkg/base/utils/uri-helper';
import type { PasteProcessBase, AppProcess, DeleteProcessBase } from '#pkg/domain/types';
import { DELETE_PROCESS_STATUS, PROCESS_TYPE, PASTE_PROCESS_STATUS } from '#pkg/domain/types';

export const fakeFileStat: IFileStatWithMetadata = {
  isDirectory: false,
  isFile: true,
  isSymbolicLink: false,
  name: 'test-file.txt',
  resource: uriHelper.parseUri(network.Schemas.file, `/home/testdir/testfile.txt`),
  ctime: dayjs('2021-03-05T17:49:51.123Z').unix(),
  mtime: dayjs('2021-05-08T18:59:01.456Z').unix(),
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
  destinationDirectory: uriHelper.parseUri(network.Schemas.file, `/home/testdir/`),
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
