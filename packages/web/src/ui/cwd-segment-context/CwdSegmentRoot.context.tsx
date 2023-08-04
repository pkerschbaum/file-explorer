import type { UpdateFn } from '@file-explorer/code-oss-ecma/types';

import * as globalStateHooks from '#pkg/global-state/slices/explorers.hooks';
import type {
  REASON_FOR_SELECTION_CHANGE,
  RenameHistoryKeys,
  ResourcesView,
} from '#pkg/global-state/slices/explorers.slice';
import {
  setFilterInput,
  setKeysOfSelectedResources,
  setActiveResourcesView,
  setScrollTop,
  setReasonForLastSelectionChange,
} from '#pkg/operations/explorer.operations';
import { useExplorerId } from '#pkg/ui/explorer-context';
import { createContext } from '#pkg/ui/utils/react.util';

type CwdSegmentRootContext = { segmentIdx: number };

const cwdSegmentRootContext = createContext<CwdSegmentRootContext>('CwdSegmentRoot');
const useCwdSegmentRootContext = cwdSegmentRootContext.useContextValue;
const RootContextProvider = cwdSegmentRootContext.Provider;

type CwdSegmentRootContextProviderProps = {
  segmentIdx: number;
  children: React.ReactNode;
};

export const CwdSegmentRootContextProvider: React.FC<CwdSegmentRootContextProviderProps> = ({
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
  return useCwdSegmentRootContext().segmentIdx;
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

export function useReasonForLastSelectionChange() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return globalStateHooks.useReasonForLastSelectionChange(explorerId, segmentIdx);
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

export function useIsLastSelectedResource(resourceKey: string) {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  const keyOfLastSelectedResource = globalStateHooks.useKeyOfLastSelectedResource(
    explorerId,
    segmentIdx,
  );
  return (keyOfLastSelectedResource ?? []).includes(resourceKey);
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

export function useSetReasonForLastSelectionChange() {
  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  return (
    newValueOrUpdateFn:
      | REASON_FOR_SELECTION_CHANGE
      | undefined
      | UpdateFn<REASON_FOR_SELECTION_CHANGE | undefined>,
  ) => setReasonForLastSelectionChange(explorerId, segmentIdx, newValueOrUpdateFn);
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
