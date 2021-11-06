import * as React from 'react';
import { useImmer } from 'use-immer';

import { ExplorerDerivedValuesContextProvider } from '@app/ui/explorer-context/ExplorerDerivedValues.context';
import { ExplorerOperationsContextProvider } from '@app/ui/explorer-context/ExplorerOperations.context';
import { createSelectableContext } from '@app/ui/utils/react.util';

export type ExplorerState = {
  filterInput: string;
  selection: {
    keysOfSelectedFiles: string[];
    keyOfFileSelectionGotStartedWith: string | undefined;
  };
  keyOfFileToRename: string | undefined;
};

export type ExplorerStateUpdateFunctions = {
  setFilterInput: (newValue: string) => void;
  setKeysOfSelectedFiles: (newKeys: string[]) => void;
  setKeyOfFileToRename: (newValue: string | undefined) => void;
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
      keysOfSelectedFiles: [],
      keyOfFileSelectionGotStartedWith: undefined,
    },
    keyOfFileToRename: undefined,
  });

  const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = React.useMemo(
    () => ({
      setFilterInput: (newValue) => {
        updateExplorerState((draft) => {
          draft.filterInput = newValue;
        });
      },

      setKeysOfSelectedFiles: (newKeys) => {
        updateExplorerState((draft) => {
          draft.selection = {
            keysOfSelectedFiles: newKeys,
            keyOfFileSelectionGotStartedWith:
              newKeys.length === 1 ? newKeys[0] : draft.selection.keyOfFileSelectionGotStartedWith,
          };
        });
      },

      setKeyOfFileToRename: (newValue) => {
        updateExplorerState((draft) => {
          draft.keyOfFileToRename = newValue;
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
        setKeysOfSelectedFiles={explorerStateUpdateFunctions.setKeysOfSelectedFiles}
      >
        <ExplorerOperationsContextProvider>{children}</ExplorerOperationsContextProvider>
      </ExplorerDerivedValuesContextProvider>
    </ExplorerStateContextProvider>
  );
};

export function useFilterInput() {
  return useExplorerStateSelector((explorerValues) => explorerValues.filterInput);
}

export function useKeyOfFileSelectionGotStartedWith() {
  return useExplorerStateSelector(
    (explorerValues) => explorerValues.selection.keyOfFileSelectionGotStartedWith,
  );
}

export function useKeyOfFileToRename() {
  return useExplorerStateSelector((explorerValues) => explorerValues.keyOfFileToRename);
}

export function useSetFilterInput() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setFilterInput);
}

export function useSetKeysOfSelectedFiles() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setKeysOfSelectedFiles);
}

export function useSetKeyOfFileToRename() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setKeyOfFileToRename);
}
