import * as React from 'react';
import { useImmer } from 'use-immer';

import { UpdateFn } from '@app/domain/types';
import { ExplorerDerivedValuesContextProvider } from '@app/ui/explorer-context/ExplorerDerivedValues.context';
import { ExplorerOperationsContextProvider } from '@app/ui/explorer-context/ExplorerOperations.context';
import { createSelectableContext } from '@app/ui/utils/react.util';

type RenameHistoryKeys = string[];
type ResourcesView = undefined | 'table' | 'gallery';

export type ExplorerState = {
  filterInput: string;
  selection: {
    keysOfSelectedResources: RenameHistoryKeys[];
    keyOfResourceSelectionGotStartedWith: RenameHistoryKeys | undefined;
  };
  keyOfResourceToRename: string | undefined;
  activeResourcesView: ResourcesView;
};

export type ExplorerStateUpdateFunctions = {
  setFilterInput: (newValue: string) => void;
  setKeysOfSelectedResources: (
    newKeysOrFunction: RenameHistoryKeys[] | UpdateFn<RenameHistoryKeys[]>,
  ) => void;
  setKeyOfResourceToRename: (
    newValueOrFunction: string | undefined | UpdateFn<string | undefined>,
  ) => void;
  setActiveResourcesView: (newValueOrFunction: ResourcesView | UpdateFn<ResourcesView>) => void;
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
    filterInput: '',
    selection: {
      keysOfSelectedResources: [],
      keyOfResourceSelectionGotStartedWith: undefined,
    },
    keyOfResourceToRename: undefined,
    activeResourcesView: undefined,
  });

  const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = React.useMemo(
    () => ({
      setFilterInput: (newValue) => {
        updateExplorerState((draft) => {
          draft.filterInput = newValue;
        });
      },

      setKeysOfSelectedResources: (newKeysOrUpdateFn) => {
        updateExplorerState((draft) => {
          let newValue;
          if (typeof newKeysOrUpdateFn === 'function') {
            newValue = newKeysOrUpdateFn(draft.selection.keysOfSelectedResources);
          } else {
            newValue = newKeysOrUpdateFn;
          }

          draft.selection = {
            keysOfSelectedResources: newValue,
            keyOfResourceSelectionGotStartedWith:
              newValue.length === 1
                ? newValue[0]
                : draft.selection.keyOfResourceSelectionGotStartedWith,
          };
        });
      },

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

      setActiveResourcesView: (newValueOrUpdateFn) => {
        updateExplorerState((draft) => {
          let newValue;
          if (typeof newValueOrUpdateFn === 'function') {
            newValue = newValueOrUpdateFn(draft.activeResourcesView);
          } else {
            newValue = newValueOrUpdateFn;
          }

          draft.activeResourcesView = newValue;
        });
      },
    }),
    [updateExplorerState],
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
        explorerState={explorerState}
      >
        <ExplorerOperationsContextProvider>{children}</ExplorerOperationsContextProvider>
      </ExplorerDerivedValuesContextProvider>
    </ExplorerStateContextProvider>
  );
};

export function useFilterInput() {
  return useExplorerStateSelector((explorerValues) => explorerValues.filterInput);
}

export function useKeyOfResourceSelectionGotStartedWith() {
  return useExplorerStateSelector(
    (explorerValues) => explorerValues.selection.keyOfResourceSelectionGotStartedWith,
  );
}

export function useKeyOfLastSelectedResource() {
  return useExplorerStateSelector(
    (explorerValues) =>
      explorerValues.selection.keysOfSelectedResources[
        explorerValues.selection.keysOfSelectedResources.length - 1
      ],
  );
}

export function useKeyOfResourceToRename() {
  return useExplorerStateSelector((explorerValues) => explorerValues.keyOfResourceToRename);
}

export function useActiveResourcesView() {
  return useExplorerStateSelector((explorerValues) => explorerValues.activeResourcesView);
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
