import invariant from 'tiny-invariant';

import type { ExplorerPanel, RenameHistoryKeys } from '#pkg/global-state/slices/explorers.slice';
import { useSelector } from '#pkg/global-state/store';

export type ExplorerPanelEntry = ExplorerPanel & {
  explorerId: string;
};

export const useExplorerPanels: () => ExplorerPanelEntry[] = () =>
  Object.entries(useSelector((state) => state.explorersSlice.explorerPanels)).map(
    ([explorerId, value]) => ({
      explorerId,
      ...value,
    }),
  );

export const useCwdSegments = (explorerId: string) =>
  useSelector((state) => state.explorersSlice.explorerPanels[explorerId].cwdSegments).filter(
    (segment) => !segment.markedForRemoval,
  );

export const useVersionOfExplorer = (explorerId: string) =>
  useSelector((state) => state.explorersSlice.explorerPanels[explorerId].version);

export const useCwd = (explorerId: string) =>
  useSelector((state) => {
    return extractCwdFromExplorerPanel(state.explorersSlice.explorerPanels[explorerId]);
  });

export const useSegmentUri = (explorerId: string, segmentIdx: number) =>
  useSelector(
    (state) => state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].uri,
  );

export const useFilterInput = (explorerId: string, segmentIdx: number) =>
  useSelector(
    (state) => state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].filterInput,
  );

export const useReasonForLastSelectionChange = (explorerId: string, segmentIdx: number) =>
  useSelector(
    (state) =>
      state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].selection
        .reasonForLastSelectionChange,
  );

export const useKeysOfSelectedResources = (explorerId: string, segmentIdx: number) =>
  useSelector(
    (state) =>
      state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].selection
        .keysOfSelectedResources,
  );

export const useKeyOfResourceSelectionGotStartedWith = (explorerId: string, segmentIdx: number) =>
  useSelector(
    (state) =>
      state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].selection
        .keyOfResourceSelectionGotStartedWith,
  );

export const useKeyOfLastSelectedResource = (
  explorerId: string,
  segmentIdx: number,
): RenameHistoryKeys | undefined => {
  return useSelector((state) => {
    const keysOfSelectedResources =
      state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].selection
        .keysOfSelectedResources;
    return keysOfSelectedResources[keysOfSelectedResources.length - 1];
  });
};

export const useActiveResourcesView = (explorerId: string, segmentIdx: number) =>
  useSelector(
    (state) =>
      state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].activeResourcesView,
  );

export const useScrollTop = (explorerId: string, segmentIdx: number) =>
  useSelector(
    (state) => state.explorersSlice.explorerPanels[explorerId].cwdSegments[segmentIdx].scrollTop,
  );

export const useIdOfFocusedExplorerPanel = () =>
  useSelector((state) => state.explorersSlice.focusedExplorerPanelId);

export function extractCwdSegmentsFromExplorerPanel(
  explorerPanel: Pick<ExplorerPanel, 'cwdSegments'>,
) {
  const { cwdSegments } = explorerPanel;
  return cwdSegments.filter((segment) => !segment.markedForRemoval);
}

export function extractCwdFromExplorerPanel(explorerPanel: Pick<ExplorerPanel, 'cwdSegments'>) {
  const cwdSegments = extractCwdSegmentsFromExplorerPanel(explorerPanel);
  const newestSegmentNotScheduledToRemove = cwdSegments[cwdSegments.length - 1];
  invariant(newestSegmentNotScheduledToRemove);
  return newestSegmentNotScheduledToRemove.uri;
}
