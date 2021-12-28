import * as React from 'react';
import { useImmer } from 'use-immer';

import { UpdateFn } from '@app/domain/types';
import { RenameHistoryKeys, ResourcesView } from '@app/global-state/slices/explorers.slice';
import {
  setActiveResourcesView,
  setFilterInput,
  setKeysOfSelectedResources,
  setScrollTop,
} from '@app/operations/explorer.operations';
import { ExplorerDerivedValuesContextProvider } from '@app/ui/explorer-context/ExplorerDerivedValues.context';
import { ExplorerOperationsContextProvider } from '@app/ui/explorer-context/ExplorerOperations.context';
import { createSelectableContext } from '@app/ui/utils/react.util';

export type ExplorerState = {
  keyOfResourceToRename: string | undefined;
};

export type ExplorerStateUpdateFunctions = {
  setFilterInput: (newValue: string) => void;
  setKeysOfSelectedResources: (
    newKeysOrUpdateFn: RenameHistoryKeys[] | UpdateFn<RenameHistoryKeys[]>,
  ) => void;
  setKeyOfResourceToRename: (
    newKeysOrUpdateFn: string | undefined | UpdateFn<string | undefined>,
  ) => void;
  setActiveResourcesView: (newKeysOrUpdateFn: ResourcesView | UpdateFn<ResourcesView>) => void;
  setScrollTop: (newKeysOrUpdateFn: undefined | number) => void;
};

type ExplorerStateContext = ExplorerState & ExplorerStateUpdateFunctions;

const selectableContext = createSelectableContext<ExplorerStateContext>('ExplorerState');
const useExplorerStateSelector = selectableContext.useContextSelector;
export const ExplorerStateContextProvider = selectableContext.Provider;

export type ExplorerContextProviderProps = {
  explorerId: string;
  isActiveExplorer: boolean;
  children: React.ReactNode;
};

export const ExplorerContextProvider: React.FC<ExplorerContextProviderProps> = ({
  explorerId,
  isActiveExplorer,
  children,
}) => {
  const [explorerState, updateExplorerState] = useImmer<ExplorerState>({
    keyOfResourceToRename: undefined,
  });

  const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = React.useMemo(
    () => ({
      setFilterInput: (newValue) => setFilterInput(explorerId, newValue),

      setKeysOfSelectedResources: (newKeysOrUpdateFn) =>
        setKeysOfSelectedResources(explorerId, newKeysOrUpdateFn),

      setKeyOfResourceToRename: (newValueOrUpdateFn) => {
        updateExplorerState((draft) => {
          let newValue;
          if (typeof newValueOrUpdateFn === 'function') {
            newValue = newValueOrUpdateFn(draft.keyOfResourceToRename);
          } else {
            newValue = newValueOrUpdateFn;
          }

          draft.keyOfResourceToRename = newValue;
        });
      },

      setActiveResourcesView: (newValueOrUpdateFn) =>
        setActiveResourcesView(explorerId, newValueOrUpdateFn),

      setScrollTop: (newValue) => setScrollTop(explorerId, newValue),
    }),
    [explorerId, updateExplorerState],
  );

  return (
    <ExplorerStateContextProvider
      value={{
        ...explorerState,
        ...explorerStateUpdateFunctions,
      }}
    >
      <ExplorerDerivedValuesContextProvider
        explorerId={explorerId}
        isActiveExplorer={isActiveExplorer}
      >
        <ExplorerOperationsContextProvider>{children}</ExplorerOperationsContextProvider>
      </ExplorerDerivedValuesContextProvider>
    </ExplorerStateContextProvider>
  );
};

export function useKeyOfResourceToRename() {
  return useExplorerStateSelector((explorerValues) => explorerValues.keyOfResourceToRename);
}

export function useSetFilterInput() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setFilterInput);
}

export function useSetKeysOfSelectedResources() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setKeysOfSelectedResources);
}

export function useSetKeyOfResourceToRename() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setKeyOfResourceToRename);
}

export function useSetActiveResourcesView() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setActiveResourcesView);
}

export function useSetScrollTop() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setScrollTop);
}
