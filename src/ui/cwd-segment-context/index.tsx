import { useIdOfFocusedExplorerPanel } from '@app/global-state/slices/explorers.hooks';
import { CwdSegmentDerivedValuesContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentDerivedValues.context';
import { CwdSegmentOperationsContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentOperations.context';
import { CwdSegmentRootContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentRoot.context';
import { CwdSegmentStateContextProvider } from '@app/ui/cwd-segment-context/CwdSegmentState.context';
import { useExplorerId } from '@app/ui/explorer-panel/ExplorerPanel';
import {
  ShortcutMap,
  RegisterShortcutsResultMap,
  useRegisterGlobalShortcuts,
} from '@app/ui/GlobalShortcutsContext';
import { EventHandler, useWindowEvent } from '@app/ui/utils/react.util';

export * from '@app/ui/cwd-segment-context/CwdSegmentOperations.context';
export * from '@app/ui/cwd-segment-context/CwdSegmentDerivedValues.context';
export * from '@app/ui/cwd-segment-context/CwdSegmentRoot.context';
export * from '@app/ui/cwd-segment-context/CwdSegmentState.context';

type CwdSegmentContextProviderProps = {
  segmentIdx: number;
  children: React.ReactNode;
};

export const CwdSegmentContextProvider: React.FC<CwdSegmentContextProviderProps> = ({
  segmentIdx,
  children,
}) => (
  <CwdSegmentRootContextProvider segmentIdx={segmentIdx}>
    <CwdSegmentStateContextProvider>
      <CwdSegmentDerivedValuesContextProvider>
        <CwdSegmentOperationsContextProvider>{children}</CwdSegmentOperationsContextProvider>
      </CwdSegmentDerivedValuesContextProvider>
    </CwdSegmentStateContextProvider>
  </CwdSegmentRootContextProvider>
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
