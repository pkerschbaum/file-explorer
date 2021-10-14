import { createAction, createReducer } from '@reduxjs/toolkit';

import * as uuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';
import { UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';

export type ExplorerSliceState = {
  explorerPanels: {
    [id: string]: {
      cwd: UriComponents;
      scheduledToRemove?: boolean;
    };
  };
  focusedExplorerPanelId?: string;
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
  explorerPanels: {},
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

      state.explorerPanels[explorerId] = { cwd };
      if (state.focusedExplorerPanelId === undefined) {
        state.focusedExplorerPanelId = explorerId;
      }
    })
    .addCase(actions.markExplorerForRemoval, (state, action) => {
      const { explorerId } = action.payload;

      state.explorerPanels[explorerId].scheduledToRemove = true;

      if (explorerId === state.focusedExplorerPanelId) {
        // focused explorer got removed --> focus another explorer

        const activeExplorer = Object.entries(state.explorerPanels)
          .map(([explorerId, value]) => ({ explorerId, ...value }))
          .find((explorer) => !explorer.scheduledToRemove);

        if (activeExplorer !== undefined) {
          state.focusedExplorerPanelId = activeExplorer.explorerId;
        }
      }
    })
    .addCase(actions.removeExplorer, (state, action) => {
      const { explorerId } = action.payload;

      delete state.explorerPanels[explorerId];
    })
    .addCase(actions.changeCwd, (state, action) => {
      const { explorerId, newCwd } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      state.explorerPanels[explorerId] = { cwd: newCwd };
    })
    .addCase(actions.changeFocusedExplorer, (state, action) => {
      const { explorerId } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      state.focusedExplorerPanelId = explorerId;
    }),
);

export function generateExplorerId() {
  return uuid.generateUuid();
}

function isExplorerIdPresent(state: ExplorerSliceState, explorerId: string): boolean {
  return !!Object.keys(state.explorerPanels).find(
    (existingExplorerId) => existingExplorerId === explorerId,
  );
}
