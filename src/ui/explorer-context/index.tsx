import { useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { ExplorerDerivedValuesContextProvider } from '@app/ui/explorer-context/ExplorerDerivedValues.context';
import { ExplorerOperationsContextProvider } from '@app/ui/explorer-context/ExplorerOperations.context';
import { ExplorerRootContextProvider } from '@app/ui/explorer-context/ExplorerRoot.context';
import { ExplorerStateContextProvider } from '@app/ui/explorer-context/ExplorerState.context';
import { useExplorerId } from '@app/ui/explorer-panel/ExplorerPanel';
import {
  ShortcutMap,
  RegisterShortcutsResultMap,
  useRegisterGlobalShortcuts,
} from '@app/ui/GlobalShortcutsContext';
import { EventHandler, useWindowEvent } from '@app/ui/utils/react.util';

export * from '@app/ui/explorer-context/ExplorerOperations.context';
export * from '@app/ui/explorer-context/ExplorerDerivedValues.context';
export * from '@app/ui/explorer-context/ExplorerRoot.context';
export * from '@app/ui/explorer-context/ExplorerState.context';

type ExplorerContextProviderProps = {
  segmentIdx: number;
  children: React.ReactNode;
};

export const ExplorerContextProvider: React.FC<ExplorerContextProviderProps> = ({
  segmentIdx,
  children,
}) => (
  <ExplorerRootContextProvider segmentIdx={segmentIdx}>
    <ExplorerStateContextProvider>
      <ExplorerDerivedValuesContextProvider>
        <ExplorerOperationsContextProvider>{children}</ExplorerOperationsContextProvider>
      </ExplorerDerivedValuesContextProvider>
    </ExplorerStateContextProvider>
  </ExplorerRootContextProvider>
);

export function useIsActiveExplorer() {
  const explorerId = useExplorerId();
  const focusedExplorerId = useIdOfFocusedExplorerPanel();
  return explorerId === focusedExplorerId;
}

export function useRegisterExplorerShortcuts<ActualShortcutMap extends ShortcutMap>(
  shortcutMap: ActualShortcutMap,
): Partial<RegisterShortcutsResultMap<ActualShortcutMap>> {
  const isActiveExplorer = useIsActiveExplorer();
  return useRegisterGlobalShortcuts(!isActiveExplorer ? {} : shortcutMap);
}

export function useRegisterExplorerAuxclickHandler(eventHandlers: EventHandler<'auxclick'>[]) {
  const isActiveExplorer = useIsActiveExplorer();
  useWindowEvent('auxclick', !isActiveExplorer ? [] : eventHandlers);
}
