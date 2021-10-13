import { createAction, createReducer } from '@reduxjs/toolkit';

import * as uuid from 'code-oss-file-service/out/vs/base/common/uuid';
import { UriComponents } from 'code-oss-file-service/out/vs/base/common/uri';

export type ExplorerSliceState = {
  explorers: {
    [id: string]: {
      cwd: UriComponents;
      scheduledToRemove?: boolean;
    };
  };
  focusedExplorerId?: string;
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

const INITIAL_STATE: ExplorerSliceState = {
  explorers: {},
};

export const actions = {
  addExplorer: createAction<AddExplorerPayload>('EXPLORER_ADDED'),
  markExplorerForRemoval: createAction<RemoveExplorerPayload>('EXPLORER_MARKED_FOR_REMOVAL'),
  removeExplorer: createAction<RemoveExplorerPayload>('EXPLORER_REMOVED'),
  changeCwd: createAction<ChangeCwdPayload>('CWD_CHANGED'),
  changeFocusedExplorer: createAction<ChangeFocusedExplorerPayload>('FOCUSED_EXPLORER_CHANGED'),
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
    }),
);

export function generateExplorerId() {
  return uuid.generateUuid();
}

function isExplorerIdPresent(state: ExplorerSliceState, explorerId: string): boolean {
  return !!Object.keys(state.explorers).find(
    (existingExplorerId) => existingExplorerId === explorerId,
  );
}
