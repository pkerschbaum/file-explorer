/**
 * The GlobalShortcutContext allows to register shortcuts which are activated on the "keydown" event
 * in the capture phase.
 *
 * If the user navigates from one focusable HTML element to the next one using {Tab} or {Shift+Tab},
 * keydown events should NOT be overridden. Otherwise, the user would not be able to control the web
 * application via keyboard because global shortcuts might interfere.
 * E.g. the user might want to activate a button using {Enter}, but there is a shortcut registered
 * for {Enter} to open the currently selected folder.
 *
 * That's why we check the data attribute "LAST_FOCUS_WAS_VISIBLE"; this data attribute is set by a
 * global focus event listener and indicates if the event target matched the CSS pseudo class ":focus-visible"
 * the last time it was focused.
 * ":focus-visible" is set by the browser if a focus should be made evident on the element,
 * it is set if the element was focused by keyboard but it is NOT set if the element was focused
 * by click. Therefore it's the ideal pseudo class to determine if the user navigated to the event
 * target via keyboard ({Tab} and {Shift+Tab}).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
 *
 * Exceptions for the aforementioned rule can be made by setting the attribute "data-window-keydownhandlers-enabled"
 * on an HTML element. This is e.g. used for the explorer filter component, keydown handlers should
 * still be active for that element (in order to allow rapid filtering/navigation via keyboard).
 */

import * as React from 'react';

import { createContext, EventHandler } from '@app/ui/utils/react.util';

export const DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED = {
  datasetAttr: {
    'data-window-keydownhandlers-enabled': 'true',
  },
  attrCamelCased: 'windowKeydownhandlersEnabled',
} as const;
export const DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE = {
  attrCamelCased: 'lastFocusWasVisible',
} as const;

type Shortcut = EventHandler<'keydown'>;
type AddGlobalShorcuts = (shortcuts: Shortcut[]) => DisposeShorcuts;
type DisposeShorcuts = () => void;

const context = createContext<AddGlobalShorcuts>('GlobalShortcutsContext');
const useGlobalShortcutsContext = context.useContextValue;
const ContextProvider = context.Provider;

export type GlobalShortcutsContextProviderProps = {
  children: React.ReactNode;
};

export const GlobalShortcutsContextProvider: React.FC<GlobalShortcutsContextProviderProps> = ({
  children,
}) => {
  const shortcutsMapRef = React.useRef(new Map<symbol, Shortcut[]>());

  React.useEffect(function storeInfoIfFocusVisibleClassMatches() {
    const eventListener = (e: WindowEventMap['focus']) => {
      if (e.target instanceof HTMLElement) {
        e.target.dataset[
          DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE.attrCamelCased
        ] = `${e.target.matches(':focus-visible')}`;
      }
    };

    window.addEventListener('focus', eventListener, { capture: true });
    return () => window.removeEventListener('focus', eventListener, { capture: true });
  }, []);

  React.useEffect(function registerKeydownEventHandler() {
    const eventListener = (e: WindowEventMap['keydown']) => {
      if (
        !(e.target instanceof HTMLElement) ||
        (e.target.dataset[DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE.attrCamelCased] !== 'false' &&
          e.target.dataset[DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.attrCamelCased] !== 'true')
      ) {
        return;
      }

      const registeredShortcuts = Array.from(shortcutsMapRef.current.values()).flat();
      const matchingShortcut = registeredShortcuts.find((shortcut) => shortcut.condition(e));
      if (matchingShortcut) {
        matchingShortcut.handler(e);
        if (!matchingShortcut.continuePropagation) {
          e.stopPropagation();
        }
      }
    };

    window.addEventListener('keydown', eventListener, { capture: true });
    return () => window.removeEventListener('keydown', eventListener, { capture: true });
  }, []);

  const addGlobalShortcuts: AddGlobalShorcuts = React.useCallback((shortcuts) => {
    const shortcutsSymbol = Symbol();
    shortcutsMapRef.current.set(shortcutsSymbol, shortcuts);
    return function disposeShortcuts() {
      shortcutsMapRef.current.delete(shortcutsSymbol);
    };
  }, []);

  return <ContextProvider value={addGlobalShortcuts}>{children}</ContextProvider>;
};

export function useRegisterGlobalShortcuts(shortcuts: Shortcut[]): void {
  const addGlobalShortcuts = useGlobalShortcutsContext();

  React.useEffect(
    function registerShortcuts() {
      const disposeShortcuts = addGlobalShortcuts(shortcuts);
      return disposeShortcuts;
    },
    [addGlobalShortcuts, shortcuts],
  );
}
