import type * as React from 'react';

import { useIdOfFocusedExplorerPanel } from '#pkg/global-state/slices/explorers.hooks';
import type { ShortcutMap, RegisterShortcutsResultMap } from '#pkg/ui/GlobalShortcutsContext';
import { useRegisterGlobalShortcuts } from '#pkg/ui/GlobalShortcutsContext';
import type { EventHandler } from '#pkg/ui/utils/react.util';
import { createContext, useWindowEvent } from '#pkg/ui/utils/react.util';

type ExplorerContext = { explorerId: string };

const explorerRootContext = createContext<ExplorerContext>('ExplorerRootContext');
const useExplorerRootContext = explorerRootContext.useContextValue;
export const RootContextProvider = explorerRootContext.Provider;

export function useExplorerId() {
  return useExplorerRootContext().explorerId;
}

type ExplorerRootContextProviderProps = {
  explorerId: string;
  children: React.ReactNode;
};

export const ExplorerRootContextProvider: React.FC<ExplorerRootContextProviderProps> = ({
  explorerId,
  children,
}) => {
  return <RootContextProvider value={{ explorerId }}>{children}</RootContextProvider>;
};

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
