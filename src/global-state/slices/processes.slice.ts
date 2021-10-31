import { CancellationTokenSource } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/cancellation';
import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import { createAction, createReducer } from '@reduxjs/toolkit';

import { createLogger } from '@app/base/logger/logger';
import { arrays } from '@app/base/utils/arrays.util';
import {
  AppProcess,
  PASTE_PROCESS_STATUS,
  DeleteProcess,
  PROCESS_TYPE,
  DELETE_PROCESS_STATUS,
} from '@app/domain/types';

export type ProcessesSliceState = {
  draftPasteState?: {
    pasteShouldMove: boolean;
  };
  processes: AppProcess[];
};

type CutOrCopyFilesPayload = {
  cut: boolean;
};

type AddPasteProcessPayload = {
  id: string;
  pasteShouldMove: boolean;
  sourceUris: UriComponents[];
  destinationFolder: UriComponents;
  cancellationTokenSource: CancellationTokenSource;
};

type UpdatePasteProcessPayload =
  | {
      id: string;
      status: PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE | PASTE_PROCESS_STATUS.SUCCESS;
    }
  | {
      id: string;
      status?: PASTE_PROCESS_STATUS.RUNNING_PERFORMING_PASTE;
      totalSize?: number;
      bytesProcessed?: number;
      progressOfAtLeastOneSourceIsIndeterminate?: boolean;
    }
  | {
      id: string;
      status: PASTE_PROCESS_STATUS.FAILURE;
      error: string;
    }
  | {
      id: string;
      status: PASTE_PROCESS_STATUS.ABORT_REQUESTED | PASTE_PROCESS_STATUS.ABORT_SUCCESS;
    };

type AddDeleteProcessPayload = Omit<DeleteProcess, 'status'>;

type UpdateDeleteProcessPayload =
  | {
      id: string;
      status: DELETE_PROCESS_STATUS.RUNNING | DELETE_PROCESS_STATUS.SUCCESS;
    }
  | {
      id: string;
      status: DELETE_PROCESS_STATUS.FAILURE;
      error: string;
    };

type RemoveProcessPayload = {
  id: string;
};

const INITIAL_STATE: ProcessesSliceState = {
  processes: [],
};

const logger = createLogger('processes.slice');

export const actions = {
  cutOrCopyFiles: createAction<CutOrCopyFilesPayload>('FILES_CUT_OR_COPIED'),
  addPasteProcess: createAction<AddPasteProcessPayload>('PASTE_PROCESS_ADDED'),
  updatePasteProcess: createAction<UpdatePasteProcessPayload>('PASTE_PROCESS_UPDATED'),
  addDeleteProcess: createAction<AddDeleteProcessPayload>('DELETE_PROCESS_ADDED'),
  updateDeleteProcess: createAction<UpdateDeleteProcessPayload>('DELETE_PROCESS_UPDATED'),
  removeProcess: createAction<RemoveProcessPayload>('PROCESS_REMOVED'),
  clearDraftPasteState: createAction<void>('DRAFT_PASTE_STATE_CLEARED'),
};
export const reducer = createReducer(INITIAL_STATE, (builder) =>
  builder
    .addCase(actions.cutOrCopyFiles, (state, action) => {
      state.draftPasteState = { pasteShouldMove: action.payload.cut };
    })
    .addCase(actions.addPasteProcess, (state, action) => {
      state.processes.push({
        ...action.payload,
        type: PROCESS_TYPE.PASTE,
        status: PASTE_PROCESS_STATUS.RUNNING_DETERMINING_TOTALSIZE,
        totalSize: 0,
        bytesProcessed: 0,
        progressOfAtLeastOneSourceIsIndeterminate: false,
      });
    })
    .addCase(actions.updatePasteProcess, (state, action) => {
      const process = state.processes.find((p) => p.id === action.payload.id);

      if (!process || process.type !== PROCESS_TYPE.PASTE) {
        logger.error('should update paste process, but could not find corresponding one');
        return;
      }

      if ('totalSize' in action.payload && action.payload.totalSize !== undefined) {
        process.totalSize = action.payload.totalSize;
      }
      if ('bytesProcessed' in action.payload && action.payload.bytesProcessed !== undefined) {
        process.bytesProcessed = action.payload.bytesProcessed;
      }
      if (
        'progressOfAtLeastOneSourceIsIndeterminate' in action.payload &&
        action.payload.progressOfAtLeastOneSourceIsIndeterminate !== undefined
      ) {
        process.progressOfAtLeastOneSourceIsIndeterminate =
          action.payload.progressOfAtLeastOneSourceIsIndeterminate;
      }

      if (action.payload.status !== undefined) {
        process.status = action.payload.status;

        if (
          action.payload.status === PASTE_PROCESS_STATUS.SUCCESS ||
          action.payload.status === PASTE_PROCESS_STATUS.FAILURE ||
          action.payload.status === PASTE_PROCESS_STATUS.ABORT_SUCCESS
        ) {
          process.cancellationTokenSource.dispose();
        }
        if (
          process.status === PASTE_PROCESS_STATUS.FAILURE &&
          action.payload.status === PASTE_PROCESS_STATUS.FAILURE
        ) {
          process.error = action.payload.error;
        }
      }
    })
    .addCase(actions.addDeleteProcess, (state, action) => {
      state.processes.push({
        ...action.payload,
        status: DELETE_PROCESS_STATUS.PENDING_FOR_USER_INPUT,
      });
    })
    .addCase(actions.updateDeleteProcess, (state, action) => {
      const process = state.processes.find((p) => p.id === action.payload.id);

      if (!process || process.type !== PROCESS_TYPE.DELETE) {
        logger.error(
          'should update delete process, but could not find corresponding one',
          undefined,
          {
            id: action.payload.id,
          },
        );
        return;
      }

      process.status = action.payload.status;
      if (
        process.status === DELETE_PROCESS_STATUS.FAILURE &&
        action.payload.status === DELETE_PROCESS_STATUS.FAILURE
      ) {
        process.error = action.payload.error;
      }
    })
    .addCase(actions.removeProcess, (state, action) => {
      const { id } = action.payload;

      const processIdx = state.processes.findIndex((p) => p.id === id);

      if (processIdx < 0) {
        logger.error('should delete process, but could not find corresponding one', undefined, {
          id,
        });
        return;
      }

      arrays.pickElementAndRemove(state.processes, processIdx);
    })
    .addCase(actions.clearDraftPasteState, (state) => {
      state.draftPasteState = undefined;
    }),
);
