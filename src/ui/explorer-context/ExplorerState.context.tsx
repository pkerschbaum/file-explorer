import * as React from 'react';
import { useImmer } from 'use-immer';

import { ExplorerDerivedValuesContextProvider } from '@app/ui/explorer-context/ExplorerDerivedValues.context';
import { ExplorerOperationsContextProvider } from '@app/ui/explorer-context/ExplorerOperations.context';
import { createSelectableContext } from '@app/ui/utils/react.util';

export type ExplorerState = {
  filterInput: string;
  selection: {
    keysOfSelectedResources: string[];
    keyOfResourceSelectionGotStartedWith: string | undefined;
  };
  keyOfResourceToRename: string | undefined;
};

export type ExplorerStateUpdateFunctions = {
  setFilterInput: (newValue: string) => void;
  setKeysOfSelectedResources: (newKeys: string[]) => void;
  setKeyOfResourceToRename: (newValue: string | undefined) => void;
};

type ExplorerStateContext = ExplorerState & ExplorerStateUpdateFunctions;

const selectableContext = createSelectableContext<ExplorerStateContext>('ExplorerState');
const useExplorerStateSelector = selectableContext.useContextSelector;
export const ExplorerStateContextProvider = selectableContext.Provider;

export type ExplorerContextProviderProps = {
  explorerId: string;
  children: React.ReactNode;
};

export const ExplorerContextProvider: React.FC<ExplorerContextProviderProps> = ({
  explorerId,
  children,
}) => {
  const [explorerState, updateExplorerState] = useImmer<ExplorerState>({
    filterInput: '',
    selection: {
      keysOfSelectedResources: [],
      keyOfResourceSelectionGotStartedWith: undefined,
    },
    keyOfResourceToRename: undefined,
  });

  const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = React.useMemo(
    () => ({
      setFilterInput: (newValue) => {
        updateExplorerState((draft) => {
          draft.filterInput = newValue;
        });
      },

      setKeysOfSelectedResources: (newKeys) => {
        updateExplorerState((draft) => {
          draft.selection = {
            keysOfSelectedResources: newKeys,
            keyOfResourceSelectionGotStartedWith:
              newKeys.length === 1
                ? newKeys[0]
                : draft.selection.keyOfResourceSelectionGotStartedWith,
          };
        });
      },

      setKeyOfResourceToRename: (newValue) => {
        updateExplorerState((draft) => {
          draft.keyOfResourceToRename = newValue;
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
        explorerState={explorerState}
        setKeysOfSelectedResources={explorerStateUpdateFunctions.setKeysOfSelectedResources}
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
