import { ExplorerPanel } from '@app/global-state/slices/explorers.slice';
import { useSelector } from '@app/global-state/store';

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
  useSelector((state) => state.explorersSlice.explorerPanels[explorerId].cwdSegments);

export const useCwd = (explorerId: string) =>
  useSelector((state) =>
    extractCwdFromExplorerPanel(state.explorersSlice.explorerPanels[explorerId]),
  );

export const useFilterInput = (explorerId: string) =>
  useSelector(
    (state) =>
      extractCurrentSegmentFromExplorerPanel(state.explorersSlice.explorerPanels[explorerId])
        .filterInput,
  );

export const useKeysOfSelectedResources = (explorerId: string) =>
  useSelector(
    (state) =>
      extractCurrentSegmentFromExplorerPanel(state.explorersSlice.explorerPanels[explorerId])
        .selection.keysOfSelectedResources,
  );

export const useKeyOfResourceSelectionGotStartedWith = (explorerId: string) =>
  useSelector(
    (state) =>
      extractCurrentSegmentFromExplorerPanel(state.explorersSlice.explorerPanels[explorerId])
        .selection.keyOfResourceSelectionGotStartedWith,
  );

export const useKeyOfLastSelectedResource = (explorerId: string) => {
  return useSelector((state) => {
    const keysOfSelectedResources = extractCurrentSegmentFromExplorerPanel(
      state.explorersSlice.explorerPanels[explorerId],
    ).selection.keysOfSelectedResources;
    return keysOfSelectedResources[keysOfSelectedResources.length - 1];
  });
};

export const useActiveResourcesView = (explorerId: string) =>
  useSelector(
    (state) =>
      extractCurrentSegmentFromExplorerPanel(state.explorersSlice.explorerPanels[explorerId])
        .activeResourcesView,
  );

export const useScrollTop = (explorerId: string) =>
  useSelector(
    (state) =>
      extractCurrentSegmentFromExplorerPanel(state.explorersSlice.explorerPanels[explorerId])
        .scrollTop,
  );

export const useIdOfFocusedExplorerPanel = () =>
  useSelector((state) => state.explorersSlice.focusedExplorerPanelId);

export function extractCurrentSegmentFromExplorerPanel(explorerPanel: ExplorerPanel) {
  const { cwdSegments: cwdSegmentsStack } = explorerPanel;
  return cwdSegmentsStack[cwdSegmentsStack.length - 1];
}

export function extractCwdFromExplorerPanel(explorerPanel: ExplorerPanel) {
  return extractCurrentSegmentFromExplorerPanel(explorerPanel).uri;
}
