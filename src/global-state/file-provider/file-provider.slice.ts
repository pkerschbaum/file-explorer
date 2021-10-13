import { createAction, createReducer } from '@reduxjs/toolkit';

import * as uuid from 'code-oss-file-service/out/vs/base/common/uuid';
import { UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';
import { CancellationTokenSource } from 'code-oss-file-service/out/vs/base/common/cancellation';

import { createLogger } from '@app/base/logger/logger';
import {
  Process,
  PASTE_PROCESS_STATUS,
  DeleteProcess,
  PROCESS_TYPE,
  DELETE_PROCESS_STATUS,
} from '@app/domain/types';
import { arrays } from '@app/base/utils/arrays.util';

export type FileProviderState = {
  explorers: {
    [id: string]: {
      cwd: UriComponents;
      scheduledToRemove?: boolean;
    };
  };
  focusedExplorerId?: string;
  draftPasteState?: {
    pasteShouldMove: boolean;
  };
  processes: Process[];
};

type AddExplorerPayload = {
  explorerId: string;
  cwd: UriComponents;
};

type RemoveExplorerPayload = {
  explorerId: string;
};

type ChangeCwdPayload = {
  explorerId: string;
  newCwd: UriComponents;
};

type ChangeFocusedExplorerPayload = {
  explorerId: string;
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

const INITIAL_STATE: FileProviderState = {
  explorers: {},
  processes: [],
};

const logger = createLogger('file-provider.slice');

export const actions = {
  addExplorer: createAction<AddExplorerPayload>('EXPLORER_ADDED'),
  markExplorerForRemoval: createAction<RemoveExplorerPayload>('EXPLORER_MARKED_FOR_REMOVAL'),
  removeExplorer: createAction<RemoveExplorerPayload>('EXPLORER_REMOVED'),
  changeCwd: createAction<ChangeCwdPayload>('CWD_CHANGED'),
  changeFocusedExplorer: createAction<ChangeFocusedExplorerPayload>('FOCUSED_EXPLORER_CHANGED'),
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
    .addCase(actions.addExplorer, (state, action) => {
      const { explorerId, cwd } = action.payload;

      if (isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event "EXPLORER_ADDED" must be dispatched with a new, unused explorerId, ` +
            `but given explorerId is already used! explorerId=${explorerId}`,
        );
      }

      state.explorers[explorerId] = { cwd };
      if (state.focusedExplorerId === undefined) {
        state.focusedExplorerId = explorerId;
      }
    })
    .addCase(actions.markExplorerForRemoval, (state, action) => {
      const { explorerId } = action.payload;

      state.explorers[explorerId].scheduledToRemove = true;

      if (explorerId === state.focusedExplorerId) {
        // focused explorer got removed --> focus another explorer

        const activeExplorer = Object.entries(state.explorers)
          .map(([explorerId, value]) => ({ explorerId, ...value }))
          .find((explorer) => !explorer.scheduledToRemove);

        if (activeExplorer !== undefined) {
          state.focusedExplorerId = activeExplorer.explorerId;
        }
      }
    })
    .addCase(actions.removeExplorer, (state, action) => {
      const { explorerId } = action.payload;

      delete state.explorers[explorerId];
    })
    .addCase(actions.changeCwd, (state, action) => {
      const { explorerId, newCwd } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      state.explorers[explorerId] = { cwd: newCwd };
    })
    .addCase(actions.changeFocusedExplorer, (state, action) => {
      const { explorerId } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      state.focusedExplorerId = explorerId;
    })
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

export function generateExplorerId() {
  return uuid.generateUuid();
}

function isExplorerIdPresent(state: FileProviderState, explorerId: string): boolean {
  return !!Object.keys(state.explorers).find(
    (existingExplorerId) => existingExplorerId === explorerId,
  );
}
