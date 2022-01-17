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
  version: number;
  markedForRemoval?: boolean;
};

export type CwdSegment = {
  uri: UriComponents;

  filterInput: string;
  selection: {
    reasonForLastSelectionChange?: REASON_FOR_SELECTION_CHANGE;
    keysOfSelectedResources: RenameHistoryKeys[];
    keyOfResourceSelectionGotStartedWith: RenameHistoryKeys | undefined;
  };
  activeResourcesView: ResourcesView;
  scrollTop: number;

  markedForRemoval?: boolean;
};

export enum REASON_FOR_SELECTION_CHANGE {
  USER_CHANGED_SELECTION = 'USER_CHANGED_SELECTION',
  NEW_FOLDER_WAS_CREATED = 'NEW_FOLDER_WAS_CREATED',
  RESET = 'RESET',
}

export type RenameHistoryKeys = string[];
export type ResourcesView = undefined | 'table' | 'gallery';

type AddExplorerPayload = {
  explorerId: string;
  cwdSegments: CwdSegment[];
};

type RemoveExplorerPayload = {
  explorerId: string;
};

type UpdateCwdSegmentPayload = {
  explorerId: string;
  segmentIdx: number;

  filterInput?: string;
  selection?: {
    reasonForLastSelectionChange?: REASON_FOR_SELECTION_CHANGE;
    keysOfSelectedResources?: RenameHistoryKeys[];
    keyOfResourceSelectionGotStartedWith?: RenameHistoryKeys | undefined;
  };
  activeResourcesView?: ResourcesView;
  scrollTop?: number;
};

type ChangeCwdPayload = {
  explorerId: string;
  newCwd: UriComponents;
  keepExistingCwdSegments: boolean;
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
  updateCwdSegment: createAction<UpdateCwdSegmentPayload>('CWD_SEGMENT_UPDATED'),
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

      state.explorerPanels[explorerId] = { cwdSegments, version: 1 };
      if (state.focusedExplorerPanelId === undefined) {
        state.focusedExplorerPanelId = explorerId;
      }
    })
    .addCase(actions.markExplorerForRemoval, (state, action) => {
      const { explorerId } = action.payload;

      state.explorerPanels[explorerId].markedForRemoval = true;

      if (explorerId === state.focusedExplorerPanelId) {
        // focused explorer got removed --> focus another explorer

        const activeExplorer = Object.entries(state.explorerPanels)
          .map(([explorerId, value]) => ({ explorerId, ...value }))
          .find((explorer) => !explorer.markedForRemoval);

        if (activeExplorer !== undefined) {
          state.focusedExplorerPanelId = activeExplorer.explorerId;
        }
      }
    })
    .addCase(actions.removeExplorer, (state, action) => {
      const { explorerId } = action.payload;

      delete state.explorerPanels[explorerId];
    })
    .addCase(actions.updateCwdSegment, (state, action) => {
      const { explorerId, segmentIdx, ...updateData } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      const cwdSegmentToUpdate = state.explorerPanels[explorerId].cwdSegments[segmentIdx];
      if (check.isNotNullish(updateData.filterInput)) {
        cwdSegmentToUpdate.filterInput = updateData.filterInput;
      }
      if (
        check.isNotNullish(updateData.selection) &&
        check.isNotNullish(updateData.selection.reasonForLastSelectionChange)
      ) {
        cwdSegmentToUpdate.selection.reasonForLastSelectionChange =
          updateData.selection.reasonForLastSelectionChange;
      }
      if (
        check.isNotNullish(updateData.selection) &&
        check.isNotNullish(updateData.selection.keysOfSelectedResources)
      ) {
        cwdSegmentToUpdate.selection.keysOfSelectedResources =
          updateData.selection.keysOfSelectedResources;
      }
      if (
        check.isNotNullish(updateData.selection) &&
        check.isNotNullish(updateData.selection.keyOfResourceSelectionGotStartedWith)
      ) {
        cwdSegmentToUpdate.selection.keyOfResourceSelectionGotStartedWith =
          updateData.selection.keyOfResourceSelectionGotStartedWith;
      }
      if (check.isNotNullish(updateData.activeResourcesView)) {
        const currentResourcesView = cwdSegmentToUpdate.activeResourcesView ?? 'table';
        const newResourcesView = updateData.activeResourcesView;

        cwdSegmentToUpdate.activeResourcesView = newResourcesView;

        // reset scrollTop on active resources change
        if (currentResourcesView !== newResourcesView) {
          cwdSegmentToUpdate.scrollTop = 0;
        }
      }
      if (check.isNotNullish(updateData.scrollTop)) {
        cwdSegmentToUpdate.scrollTop = updateData.scrollTop;
      }
    })
    .addCase(actions.changeCwd, (state, action) => {
      const { explorerId, newCwd, keepExistingCwdSegments } = action.payload;

      if (!isExplorerIdPresent(state, explorerId)) {
        throw new Error(
          `event must be dispatched with an existing explorerId, ` +
            `but given explorerId is not present in state! explorerId=${explorerId}`,
        );
      }

      let newCwdSegments;
      let explorerVersionToUse;
      if (!keepExistingCwdSegments) {
        /**
         * If the cwd segments should not be kept, we just compute new CWD segments from the given URI
         * and increment the version number of the explorer panel by 1. This version number is used by
         * the ExplorerPanel component to completely unmount and remount, so that no animations are
         * performed, all state is reset to its initial state, etc.
         */
        newCwdSegments = computeCwdSegmentsFromUri(newCwd);
        explorerVersionToUse = state.explorerPanels[explorerId].version + 1;
      } else {
        /**
         * If the cwd segments should be kept, we keep the current version number of the explorer panel,
         * compute new CWD segments from the given URI but take as much information as possible from
         * the current CWD segments.
         */
        newCwdSegments = computeCwdSegmentsFromUri(newCwd);
        explorerVersionToUse = state.explorerPanels[explorerId].version;

        const currentCwdSegments = state.explorerPanels[explorerId].cwdSegments;
        const maxSegmentsLength = Math.max(currentCwdSegments.length, newCwdSegments.length);
        for (let idx = 0; idx < maxSegmentsLength; idx++) {
          /**
           * Copy old segment if the uri of the old segment is equal to the uri of the new segment (and
           * the segment is not marked for removal) in order to keep the state of the old segments.
           */
          if (
            currentCwdSegments.length > idx &&
            !currentCwdSegments[idx].markedForRemoval &&
            newCwdSegments.length > idx &&
            resources.isEqual(
              URI.from(currentCwdSegments[idx].uri),
              URI.from(newCwdSegments[idx].uri),
            )
          ) {
            newCwdSegments[idx] = currentCwdSegments[idx];
          }

          // If any segments in the current cwd are left, copy them with markedForRemoval set to true
          if (currentCwdSegments.length > idx && idx >= newCwdSegments.length) {
            newCwdSegments.push({
              ...currentCwdSegments[idx],
              markedForRemoval: true,
            });
          }
        }
      }

      state.explorerPanels[explorerId].cwdSegments = newCwdSegments;
      state.explorerPanels[explorerId].version = explorerVersionToUse;
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

export function computeCwdSegmentsFromUri(uri: UriComponents): CwdSegment[] {
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
