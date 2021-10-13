import { UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import { CancellationTokenSource } from 'code-oss-file-service/out/vs/base/common/cancellation';
import { IFileStatWithMetadata } from 'code-oss-file-service/out/vs/platform/files/common/files';

export enum FILE_TYPE {
  FILE = 'FILE',
  DIRECTORY = 'DIRECTORY',
  SYMBOLIC_LINK = 'SYMBOLIC_LINK',
  UNKNOWN = 'UNKNOWN',
}

export enum PASTE_PROCESS_STATUS {
  RUNNING_DETERMINING_TOTALSIZE = 'RUNNING_DETERMINING_TOTALSIZE',
  RUNNING_PERFORMING_PASTE = 'RUNNING_PERFORMING_PASTE',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  ABORT_REQUESTED = 'ABORT_REQUESTED',
  ABORT_SUCCESS = 'ABORT_SUCCESS',
}

export enum DELETE_PROCESS_STATUS {
  PENDING_FOR_USER_INPUT = 'PENDING_FOR_USER_INPUT',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum PROCESS_TYPE {
  PASTE = 'PASTE',
  DELETE = 'DELETE',
}

export type Process = PasteProcess | DeleteProcess;

export type PasteProcess = {
  id: string;
  type: PROCESS_TYPE.PASTE;
  pasteShouldMove: boolean;
  sourceUris: UriComponents[];
  destinationFolder: UriComponents;
  cancellationTokenSource: CancellationTokenSource;
  totalSize: number;
  bytesProcessed: number;
  progressOfAtLeastOneSourceIsIndeterminate: boolean;
} & (
  | {
      status:
        | PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE
        | PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE
        | PASTE_PROCESS_STATUS.SUCCESS
        | PASTE_PROCESS_STATUS.ABORT_REQUESTED
        | PASTE_PROCESS_STATUS.ABORT_SUCCESS;
    }
  | {
      status: PASTE_PROCESS_STATUS.FAILURE;
      error: string;
    }
);

export type DeleteProcess = {
  id: string;
  type: PROCESS_TYPE.DELETE;
  uris: UriComponents[];
} & (
  | {
      status:
        | DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT
        | DELETE_PROCESS_STATUS.RUNNING
        | DELETE_PROCESS_STATUS.SUCCESS;
    }
  | {
      status: DELETE_PROCESS_STATUS.FAILURE;
      error: string;
    }
);

export type FileMap = {
  [stringifiedUri: string]: File | undefined;
};

export type File = {
  id: string;
  fileType: FILE_TYPE;
  uri: UriComponents;
  size?: number;
  ctime?: number;
  mtime?: number;
};

export type FileStatMap = {
  [uri: string]: IFileStatWithMetadata;
};

type TagId = string;
export type FileToTags = { [uri: string]: { ctimeOfFile: number; tags: TagId[] } | undefined };
export type Tag = { id: TagId; name: string; colorHex: string };
