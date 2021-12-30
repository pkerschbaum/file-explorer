import { UpdateFn } from '@app/domain/types';
import * as globalStateHooks from '@app/global-state/slices/explorers.hooks';
import { RenameHistoryKeys, ResourcesView } from '@app/global-state/slices/explorers.slice';
import {
  setFilterInput,
  setKeysOfSelectedResources,
  setActiveResourcesView,
  setScrollTop,
} from '@app/operations/explorer.operations';
import { useExplorerId } from '@app/ui/explorer-panel/ExplorerPanel';
import { createContext } from '@app/ui/utils/react.util';

type ExplorerRootContext = { segmentIdx: number };

const explorerRootContext = createContext<ExplorerRootContext>('ExplorerRoot');
const useExplorerRootContext = explorerRootContext.useContextValue;
const RootContextProvider = explorerRootContext.Provider;

type ExplorerRootContextProviderProps = {
  segmentIdx: number;
  children: React.ReactNode;
};

export const ExplorerRootContextProvider: React.FC<ExplorerRootContextProviderProps> = ({
  segmentIdx,
  children,
}) => (
  <RootContextProvider
    value={{
      segmentIdx,
    }}
  >
    {children}
  </RootContextProvider>
);

export function useSegmentIdx() {
  return useExplorerRootContext().segmentIdx;
}

export function useIsActiveCwdSegment() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  const cwdSegmentsOfExplorer = globalStateHooks.useCwdSegments(explorerId);
  return segmentIdx === cwdSegmentsOfExplorer.length - 1;
}

export function useFilterInput() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return globalStateHooks.useFilterInput(explorerId, segmentIdx);
}

export function useKeysOfSelectedResources() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return globalStateHooks.useKeysOfSelectedResources(explorerId, segmentIdx);
}

export function useKeyOfResourceSelectionGotStartedWith() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return globalStateHooks.useKeyOfResourceSelectionGotStartedWith(explorerId, segmentIdx);
}

export function useKeyOfLastSelectedResource() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return globalStateHooks.useKeyOfLastSelectedResource(explorerId, segmentIdx);
}

export function useActiveResourcesView() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return globalStateHooks.useActiveResourcesView(explorerId, segmentIdx);
}

export function useScrollTop() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return globalStateHooks.useScrollTop(explorerId, segmentIdx);
}

export function useSetFilterInput() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return (newValue: string) => setFilterInput(explorerId, segmentIdx, newValue);
}

export function useSetKeysOfSelectedResources() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return (newValueOrUpdateFn: RenameHistoryKeys[] | UpdateFn<RenameHistoryKeys[]>) =>
    setKeysOfSelectedResources(explorerId, segmentIdx, newValueOrUpdateFn);
}

export function useSetActiveResourcesView() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return (newValueOrUpdateFn: ResourcesView | UpdateFn<ResourcesView>) =>
    setActiveResourcesView(explorerId, segmentIdx, newValueOrUpdateFn);
}

export function useSetScrollTop() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return (newValueOrUpdateFn: undefined | number) =>
    setScrollTop(explorerId, segmentIdx, newValueOrUpdateFn);
}
