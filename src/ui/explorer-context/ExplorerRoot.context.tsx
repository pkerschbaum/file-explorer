import { UpdateFn } from '@app/domain/types';
import { useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import * as globalStateHooks from '@app/global-state/slices/explorers.hooks';
import { RenameHistoryKeys, ResourcesView } from '@app/global-state/slices/explorers.slice';
import {
  setFilterInput,
  setKeysOfSelectedResources,
  setActiveResourcesView,
  setScrollTop,
} from '@app/operations/explorer.operations';
import { createContext } from '@app/ui/utils/react.util';

type ExplorerRootContext = { explorerId: string };

const explorerRootContext = createContext<ExplorerRootContext>('ExplorerRoot');
const useExplorerRootContext = explorerRootContext.useContextValue;
const RootContextProvider = explorerRootContext.Provider;

type ExplorerRootContextProviderProps = {
  explorerId: string;
  children: React.ReactNode;
};

export const ExplorerRootContextProvider: React.FC<ExplorerRootContextProviderProps> = ({
  explorerId,
  children,
}) => (
  <RootContextProvider
    value={{
      explorerId,
    }}
  >
    {children}
  </RootContextProvider>
);

export function useExplorerId() {
  return useExplorerRootContext().explorerId;
}

export function useIsActiveExplorer() {
  const explorerId = useExplorerId();
  const focusedExplorerId = useIdOfFocusedExplorerPanel();
  return explorerId === focusedExplorerId;
}

export function useFilterInput() {
  const explorerId = useExplorerId();
  return globalStateHooks.useFilterInput(explorerId);
}

export function useKeysOfSelectedResources() {
  const explorerId = useExplorerId();
  return globalStateHooks.useKeysOfSelectedResources(explorerId);
}

export function useKeyOfResourceSelectionGotStartedWith() {
  const explorerId = useExplorerId();
  return globalStateHooks.useKeyOfResourceSelectionGotStartedWith(explorerId);
}

export function useKeyOfLastSelectedResource() {
  const explorerId = useExplorerId();
  return globalStateHooks.useKeyOfLastSelectedResource(explorerId);
}

export function useActiveResourcesView() {
  const explorerId = useExplorerId();
  return globalStateHooks.useActiveResourcesView(explorerId);
}

export function useScrollTop() {
  const explorerId = useExplorerId();
  return globalStateHooks.useScrollTop(explorerId);
}

export function useSetFilterInput() {
  const explorerId = useExplorerId();
  return (newValue: string) => setFilterInput(explorerId, newValue);
}

export function useSetKeysOfSelectedResources() {
  const explorerId = useExplorerId();
  return (newValueOrUpdateFn: RenameHistoryKeys[] | UpdateFn<RenameHistoryKeys[]>) =>
    setKeysOfSelectedResources(explorerId, newValueOrUpdateFn);
}

export function useSetActiveResourcesView() {
  const explorerId = useExplorerId();
  return (newValueOrUpdateFn: ResourcesView | UpdateFn<ResourcesView>) =>
    setActiveResourcesView(explorerId, newValueOrUpdateFn);
}

export function useSetScrollTop() {
  const explorerId = useExplorerId();
  return (newValueOrUpdateFn: undefined | number) => setScrollTop(explorerId, newValueOrUpdateFn);
}
