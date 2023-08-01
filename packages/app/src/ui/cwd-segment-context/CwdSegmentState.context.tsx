import * as React from 'react';
import { useImmer } from 'use-immer';

import type { UpdateFn } from '#pkg/domain/types';
import { useSegmentUri } from '#pkg/global-state/slices/explorers.hooks';
import { useSegmentIdx } from '#pkg/ui/cwd-segment-context/CwdSegmentRoot.context';
import { useExplorerId } from '#pkg/ui/explorer-context';
import { createSelectableContext } from '#pkg/ui/utils/react.util';

export type CwdSegmentState = {
  keyOfResourceToRename: string | undefined;
};

export type CwdSegmentStateUpdateFunctions = {
  setKeyOfResourceToRename: (
    newKeysOrUpdateFn: string | undefined | UpdateFn<string | undefined>,
  ) => void;
};

type CwdSegmentStateContext = CwdSegmentState & CwdSegmentStateUpdateFunctions;

const selectableContext = createSelectableContext<CwdSegmentStateContext>('CwdSegmentState');
const useCwdSegmentStateSelector = selectableContext.useContextSelector;
const StateContextProvider = selectableContext.Provider;

type CwdSegmentContextProviderProps = {
  children: React.ReactNode;
};

const INITIAL_STATE = {
  keyOfResourceToRename: undefined,
};
export const CwdSegmentStateContextProvider: React.FC<CwdSegmentContextProviderProps> = ({
  children,
}) => {
  const [explorerState, updateExplorerState] = useImmer<CwdSegmentState>(INITIAL_STATE);

  const explorerId = useExplorerId();
  const segmentIdx = useSegmentIdx();
  const segmentUri = useSegmentUri(explorerId, segmentIdx);

  React.useLayoutEffect(
    function resetStateOnUriChange() {
      updateExplorerState(INITIAL_STATE);
    },
    [segmentUri, updateExplorerState],
  );

  const explorerStateUpdateFunctions: CwdSegmentStateUpdateFunctions = React.useMemo(
    () => ({
      setKeyOfResourceToRename: (newValueOrUpdateFn) => {
        updateExplorerState((draft) => {
          const newValue =
            typeof newValueOrUpdateFn === 'function'
              ? newValueOrUpdateFn(draft.keyOfResourceToRename)
              : newValueOrUpdateFn;

          draft.keyOfResourceToRename = newValue;
        });
      },
    }),
    [updateExplorerState],
  );

  return (
    <StateContextProvider
      value={{
        ...explorerState,
        ...explorerStateUpdateFunctions,
      }}
    >
      {children}
    </StateContextProvider>
  );
};

export function useKeyOfResourceToRename() {
  return useCwdSegmentStateSelector((explorerValues) => explorerValues.keyOfResourceToRename);
}

export function useSetKeyOfResourceToRename() {
  return useCwdSegmentStateSelector((explorerValues) => explorerValues.setKeyOfResourceToRename);
}
