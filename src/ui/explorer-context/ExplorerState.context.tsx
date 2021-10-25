import * as React from 'react';
import { useImmer } from 'use-immer';

import { ExplorerDerivedValuesContextProvider } from '@app/ui/explorer-context/ExplorerDerivedValues.context';
import { createSelectableContext } from '@app/ui/utils/react.util';

export type ExplorerState = {
  filterInput: string;
  selection: {
    idsOfSelectedFiles: string[];
    fileIdSelectionGotStartedWith: string | undefined;
  };
  fileToRenameId: string | undefined;
};

export type ExplorerStateUpdateFunctions = {
  setFilterInput: (newValue: string) => void;
  setIdsOfSelectedFiles: (newIds: string[]) => void;
  setFileToRenameId: (newValue: string | undefined) => void;
};

type ExplorerStateContext = ExplorerState & ExplorerStateUpdateFunctions;

const selectableContext = createSelectableContext<ExplorerStateContext>('ExplorerState');
const useExplorerStateSelector = selectableContext.useContextSelector;
export const ExplorerStateContextProvider = selectableContext.Provider;

export type ExplorerContextProviderProps = {
  explorerId: string;
  children: React.ReactElement;
};

export const ExplorerContextProvider: React.FC<ExplorerContextProviderProps> = (props) => {
  const [explorerState, updateExplorerState] = useImmer<ExplorerState>({
    filterInput: '',
    selection: {
      idsOfSelectedFiles: [],
      fileIdSelectionGotStartedWith: undefined,
    },
    fileToRenameId: undefined,
  });

  const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = React.useMemo(
    () => ({
      setFilterInput: (newValue) => {
        updateExplorerState((draft) => {
          draft.filterInput = newValue;
        });
      },

      setIdsOfSelectedFiles: (newIds) => {
        updateExplorerState((draft) => {
          draft.selection = {
            idsOfSelectedFiles: newIds,
            fileIdSelectionGotStartedWith:
              newIds.length === 1 ? newIds[0] : draft.selection.fileIdSelectionGotStartedWith,
          };
        });
      },

      setFileToRenameId: (newValue) => {
        updateExplorerState((draft) => {
          draft.fileToRenameId = newValue;
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
        {...props}
        explorerState={explorerState}
        setIdsOfSelectedFiles={explorerStateUpdateFunctions.setIdsOfSelectedFiles}
      />
    </ExplorerStateContextProvider>
  );
};

export function useFilterInput() {
  return useExplorerStateSelector((explorerValues) => explorerValues.filterInput);
}

export function useFileIdSelectionGotStartedWith() {
  return useExplorerStateSelector(
    (explorerValues) => explorerValues.selection.fileIdSelectionGotStartedWith,
  );
}

export function useFileToRenameId() {
  return useExplorerStateSelector((explorerValues) => explorerValues.fileToRenameId);
}

export function useSetFilterInput() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setFilterInput);
}

export function useSetIdsOfSelectedFiles() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setIdsOfSelectedFiles);
}

export function useSetFileToRenameId() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setFileToRenameId);
}
