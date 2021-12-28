import * as React from 'react';
import { useImmer } from 'use-immer';

import { UpdateFn } from '@app/domain/types';
import { createSelectableContext } from '@app/ui/utils/react.util';

export type ExplorerState = {
  keyOfResourceToRename: string | undefined;
};

export type ExplorerStateUpdateFunctions = {
  setKeyOfResourceToRename: (
    newKeysOrUpdateFn: string | undefined | UpdateFn<string | undefined>,
  ) => void;
};

type ExplorerStateContext = ExplorerState & ExplorerStateUpdateFunctions;

const selectableContext = createSelectableContext<ExplorerStateContext>('ExplorerState');
const useExplorerStateSelector = selectableContext.useContextSelector;
const StateContextProvider = selectableContext.Provider;

type ExplorerContextProviderProps = {
  children: React.ReactNode;
};

export const ExplorerStateContextProvider: React.FC<ExplorerContextProviderProps> = ({
  children,
}) => {
  const [explorerState, updateExplorerState] = useImmer<ExplorerState>({
    keyOfResourceToRename: undefined,
  });

  const explorerStateUpdateFunctions: ExplorerStateUpdateFunctions = React.useMemo(
    () => ({
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
  return useExplorerStateSelector((explorerValues) => explorerValues.keyOfResourceToRename);
}

export function useSetKeyOfResourceToRename() {
  return useExplorerStateSelector((explorerValues) => explorerValues.setKeyOfResourceToRename);
}
