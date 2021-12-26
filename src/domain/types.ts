import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { IFileStatWithMetadata } from '@pkerschbaum/code-oss-file-service/out/vs/platform/files/common/files';

export type UpdateFn<T> = (currentValue: T) => T;

export enum RESOURCE_TYPE {
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

export type AppProcess = PasteProcess | DeleteProcess;

export type PasteProcessBase = {
  id: string;
  type: PROCESS_TYPE.PASTE;
  pasteShouldMove: boolean;
  sourceUris: UriComponents[];
  destinationDirectory: UriComponents;
  cancellationTokenSource: CancellationTokenSource;
  totalSize: number;
  bytesProcessed: number;
  progressOfAtLeastOneSourceIsIndeterminate: boolean;
};

type PasteProcess_RunningDeterminingTotalsize = PasteProcessBase & {
  status: PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE;
};

type PasteProcess_RunningPerformingPaste = PasteProcessBase & {
  status: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE;
};

type PasteProcess_Success = PasteProcessBase & {
  status: PASTE_PROCESS_STATUS.SUCCESS;
};

type PasteProcess_AbortRequested = PasteProcessBase & {
  status: PASTE_PROCESS_STATUS.ABORT_REQUESTED;
};

type PasteProcess_AbortSuccess = PasteProcessBase & {
  status: PASTE_PROCESS_STATUS.ABORT_SUCCESS;
};

type PasteProcess_Failure = PasteProcessBase & {
  status: PASTE_PROCESS_STATUS.FAILURE;
  error: string;
};

export type PasteProcess =
  | PasteProcess_RunningDeterminingTotalsize
  | PasteProcess_RunningPerformingPaste
  | PasteProcess_Success
  | PasteProcess_AbortRequested
  | PasteProcess_AbortSuccess
  | PasteProcess_Failure;

export type DeleteProcessBase = {
  id: string;
  type: PROCESS_TYPE.DELETE;
  uris: UriComponents[];
};

type DeleteProcess_PendingForUserInput = DeleteProcessBase & {
  status: DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT;
};

type DeleteProcess_Running = DeleteProcessBase & {
  status: DELETE_PROCESS_STATUS.RUNNING;
};

type DeleteProcess_Success = DeleteProcessBase & {
  status: DELETE_PROCESS_STATUS.SUCCESS;
};

type DeleteProcess_Failure = DeleteProcessBase & {
  status: DELETE_PROCESS_STATUS.FAILURE;
  error: string;
};

export type DeleteProcess =
  | DeleteProcess_PendingForUserInput
  | DeleteProcess_Running
  | DeleteProcess_Success
  | DeleteProcess_Failure;

export type ResourceStat = {
  key: string;
  uri: UriComponents;
  resourceType: RESOURCE_TYPE;
  size?: number;
  ctime?: number;
  mtime?: number;
};

export type ResourceStatMap = {
  [uri: string]: IFileStatWithMetadata;
};

type TagId = string;
export type ResourcesToTags = {
  [uri: string]: { ctimeOfResource: number; tags: TagId[] } | undefined;
};
export type AvailableTagIds = `tag-color-${
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'}`;
export type Tag = { id: TagId; name: string; colorId: AvailableTagIds };

export type ResourceForUI = ResourceStat & {
  basename: string;
  extension?: string;
  tags: Tag[];
};
