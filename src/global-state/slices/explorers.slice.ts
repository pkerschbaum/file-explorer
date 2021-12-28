import * as resources from '@pkerschbaum/code-oss-file-service/out/vs/base/common/resources';
import { URI, UriComponents } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uri';
import * as uuid from '@pkerschbaum/code-oss-file-service/out/vs/base/common/uuid';
import { createAction, createReducer } from '@reduxjs/toolkit';

import { check } from '@app/base/utils/assert.util';
import { uriHelper } from '@app/base/utils/uri-helper';

export type ExplorerSliceState = {
  explorerPanels: ExplorersMap;
  focusedExplorerPanelId?: string;
};

export type ExplorersMap = {
  [id: string]: ExplorerPanel;
};

export type ExplorerPanel = {
  cwdSegments: CwdSegment[];
  scheduledToRemove?: boolean;
};

export type CwdSegment = {
  uri: UriComponents;
  filterInput: string;
  selection: {
    keysOfSelectedResources: RenameHistoryKeys[];
    keyOfResourceSelectionGotStartedWith: RenameHistoryKeys | undefined;
  };
  activeResourcesView: ResourcesView;
  scrollTop: number;
};

export type RenameHistoryKeys = string[];
export type ResourcesView = undefined | 'table' | 'gallery';

type AddExplorerPayload = {
  explorerId: string;
  cwdSegments: CwdSegment[];
};

type RemoveExplorerPayload = {
  explorerId: string;
};

type UpdateCurrentCwdSegmentPayload = {
  explorerId: string;
  filterInput?: string;
  selection?: {
    keysOfSelectedResources?: RenameHistoryKeys[];
    keyOfResourceSelectionGotStartedWith?: RenameHistoryKeys | undefined;
  };
  activeResourcesView?: ResourcesView;
  scrollTop?: number;
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
  updateCurrentCwdSegment: createAction<UpdateCurrentCwdSegmentPayload>(
    'CURRENT_CWD_SEGMENT_UPDATED',
  ),
  changeCwd: createAction<ChangeCwdPayload>('CWD_CHANGED'),
  changeFocusedExplorer: createAction<ChangeFocusedExplorerPayload>('FOCUSED_EXPLORER_CHANGED'),
};
export const reducer = createReducer(INITIAL_STATE, (builder) =>
  builder
    .addCase(actions.addExplorer, (state, action) => {
      const { explorerId, cwdSegments } = action.payload;

      if (isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event "EXPLORER_ADDED" must be dispatched with a new, unused explorerId, ` +
            `but given explorerId is already used! explorerId=${explorerId}`,
        );
      }

      state.explorerPanels[explorerId] = { cwdSegments };
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
    .addCase(actions.updateCurrentCwdSegment, (state, action) => {
      const { explorerId, ...updateData } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      const currentCwdSegment =
        state.explorerPanels[explorerId].cwdSegments[
          state.explorerPanels[explorerId].cwdSegments.length - 1
        ];
      if (check.isNotNullish(updateData.filterInput)) {
        currentCwdSegment.filterInput = updateData.filterInput;
      }
      if (
        check.isNotNullish(updateData.selection) &&
        check.isNotNullish(updateData.selection.keysOfSelectedResources)
      ) {
        currentCwdSegment.selection.keysOfSelectedResources =
          updateData.selection.keysOfSelectedResources;
      }
      if (
        check.isNotNullish(updateData.selection) &&
        check.isNotNullish(updateData.selection.keyOfResourceSelectionGotStartedWith)
      ) {
        currentCwdSegment.selection.keyOfResourceSelectionGotStartedWith =
          updateData.selection.keyOfResourceSelectionGotStartedWith;
      }
      if (check.isNotNullish(updateData.activeResourcesView)) {
        const currentResourcesView = currentCwdSegment.activeResourcesView ?? 'table';
        const newResourcesView = updateData.activeResourcesView;

        currentCwdSegment.activeResourcesView = newResourcesView;

        // reset scrollTop on active resources change
        if (currentResourcesView !== newResourcesView) {
          currentCwdSegment.scrollTop = 0;
        }
      }
      if (check.isNotNullish(updateData.scrollTop)) {
        currentCwdSegment.scrollTop = updateData.scrollTop;
      }
    })
    .addCase(actions.changeCwd, (state, action) => {
      const { explorerId, newCwd } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      const currentCwdSegmentsStack = state.explorerPanels[explorerId].cwdSegments;
      const newCwdSegmentsStack = computeCwdSegmentsStackFromUri(newCwd);
      for (let idx = 0; idx < newCwdSegmentsStack.length; idx++) {
        if (
          currentCwdSegmentsStack.length > idx &&
          resources.isEqual(
            URI.from(currentCwdSegmentsStack[idx].uri),
            URI.from(newCwdSegmentsStack[idx].uri),
          )
        ) {
          newCwdSegmentsStack[idx] = currentCwdSegmentsStack[idx];
        }
      }

      state.explorerPanels[explorerId].cwdSegments = newCwdSegmentsStack;
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

export function computeCwdSegmentsStackFromUri(uri: UriComponents): CwdSegment[] {
  return uriHelper.splitUriIntoSegments(uri).map((uriSegment) => ({
    uri: uriSegment,
    filterInput: '',
    selection: {
      keysOfSelectedResources: [],
      keyOfResourceSelectionGotStartedWith: undefined,
    },
    activeResourcesView: undefined,
    scrollTop: 0,
  }));
}

function isExplorerIdPresent(state: ExplorerSliceState, explorerId: string): boolean {
  return !!Object.keys(state.explorerPanels).find(
    (existingExplorerId) => existingExplorerId === explorerId,
  );
}
