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

import { objects } from '@app/base/utils/objects.util';
import { KEY } from '@app/ui/constants';
import { createContext } from '@app/ui/utils/react.util';
import { KEY_TO_VISUALIZATION_MAP } from '@app/ui/visual-key/key-to-visualization-map';

export const DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED = {
  datasetAttr: {
    'data-window-keydownhandlers-enabled': 'true',
  },
  attrCamelCased: 'windowKeydownhandlersEnabled',
} as const;
export const DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE = {
  attrCamelCased: 'lastFocusWasVisible',
} as const;

export type ShortcutMap = {
  [shortcutName: string]: Shortcut;
};
type Shortcut = {
  keybindings?: Keybinding[];
  condition?: (e: WindowEventMap['keydown']) => boolean;
  handler: (e: WindowEventMap['keydown']) => void;
  continuePropagation?: boolean;
};
type Keybinding = {
  key: KEY;
  modifiers: Modifiers;
};
type Modifiers = {
  ctrl: 'SET' | 'NOT_SET';
  alt: 'SET' | 'NOT_SET';
};
type AddGlobalShortcuts = (shortcuts: Shortcut[]) => DisposeShortcuts;
type DisposeShortcuts = () => void;

const addGlobalShortcutsContext = createContext<AddGlobalShortcuts>('AddGlobalShortcutsContext');
const useAddGlobalShortcutsContext = addGlobalShortcutsContext.useContextValue;
const AddGlobalShortcutsContextProvider = addGlobalShortcutsContext.Provider;

const activeModifiersContext = createContext<Modifiers>('ActiveModifiersContext');
const useActiveModifiersContext = activeModifiersContext.useContextValue;
const ActiveModifiersContextProvider = activeModifiersContext.Provider;

export type GlobalShortcutsContextProviderProps = {
  children: React.ReactNode;
};

export const GlobalShortcutsContextProvider: React.FC<GlobalShortcutsContextProviderProps> = ({
  children,
}) => {
  const shortcutsMapRef = React.useRef(new Map<symbol, Shortcut[]>());
  const [currentlyActiveModifiers, setCurrentlyActiveModifiers] = React.useState<Modifiers>({
    ctrl: 'NOT_SET',
    alt: 'NOT_SET',
  });

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

  React.useEffect(function invokeShortcutOnKeydown() {
    const eventListener = (e: WindowEventMap['keydown']) => {
      if (!shouldEventGetProcessed(e)) {
        return;
      }

      const newActiveModifiers: Modifiers = {
        ctrl: e.ctrlKey ? 'SET' : 'NOT_SET',
        alt: e.altKey ? 'SET' : 'NOT_SET',
      };

      let matchingShortcut: Shortcut | undefined;
      const registeredShortcuts = Array.from(shortcutsMapRef.current.values()).flat();
      for (const shortcut of registeredShortcuts) {
        let matches = true;

        if (shortcut.keybindings) {
          matches =
            matches &&
            shortcut.keybindings.some(
              (keybinding) =>
                e.key === keybinding.key &&
                (!keybinding.modifiers ||
                  doesEventMatchKeybindingModifiers(newActiveModifiers, keybinding.modifiers)),
            );
        }

        if (shortcut.condition) {
          matches = matches && shortcut.condition(e);
        }

        if (matches) {
          matchingShortcut = shortcut;
          break;
        }
      }

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

  React.useEffect(function setModifiersOnKeydownAndKeyup() {
    const eventListener = (e: WindowEventMap['keydown'] | WindowEventMap['keyup']) => {
      if (!shouldEventGetProcessed(e)) {
        return;
      }

      const newActiveModifiers: Modifiers = {
        ctrl: e.ctrlKey ? 'SET' : 'NOT_SET',
        alt: e.altKey ? 'SET' : 'NOT_SET',
      };
      setCurrentlyActiveModifiers((currentActiveModifiers) => {
        if (objects.shallowIsEqual(currentActiveModifiers, newActiveModifiers)) {
          return currentActiveModifiers;
        }
        return newActiveModifiers;
      });
    };

    window.addEventListener('keydown', eventListener);
    window.addEventListener('keyup', eventListener);
    return () => {
      window.removeEventListener('keydown', eventListener);
      window.removeEventListener('keyup', eventListener);
    };
  }, []);

  const addGlobalShortcuts: AddGlobalShortcuts = React.useCallback((shortcuts) => {
    const shortcutsSymbol = Symbol();
    shortcutsMapRef.current.set(shortcutsSymbol, shortcuts);

    return function disposeShortcuts() {
      shortcutsMapRef.current.delete(shortcutsSymbol);
    };
  }, []);

  const memoizedChildren = React.useMemo(() => children, [children]);

  return (
    <AddGlobalShortcutsContextProvider value={addGlobalShortcuts}>
      <ActiveModifiersContextProvider value={currentlyActiveModifiers}>
        {memoizedChildren}
      </ActiveModifiersContextProvider>
    </AddGlobalShortcutsContextProvider>
  );
};

function shouldEventGetProcessed(e: WindowEventMap['keydown'] | WindowEventMap['keyup']) {
  return (
    e.target instanceof HTMLElement &&
    !e.repeat &&
    (e.target.dataset[DATA_ATTRIBUTE_LAST_FOCUS_WAS_VISIBLE.attrCamelCased] === 'false' ||
      e.target.dataset[DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.attrCamelCased] === 'true')
  );
}

function doesEventMatchKeybindingModifiers(
  activeModifiers: Modifiers,
  keybindingModifiers: Modifiers,
): boolean {
  let matches = true;

  matches = matches && keybindingModifiers.ctrl === activeModifiers.ctrl;
  matches = matches && keybindingModifiers.alt === activeModifiers.alt;

  return matches;
}

export type RegisterShortcutsResultMap<ActualShortcutMap extends ShortcutMap> = {
  [shortcutName in keyof ActualShortcutMap]: RegisterShortcutsResult;
};
type RegisterShortcutsResult = {
  icon: React.ReactNode;
};

export function useRegisterGlobalShortcuts<ActualShortcutMap extends ShortcutMap>(
  shortcutMap: ActualShortcutMap,
): RegisterShortcutsResultMap<ActualShortcutMap> {
  const addGlobalShortcuts = useAddGlobalShortcutsContext();
  const activeModifiers = useActiveModifiersContext();

  React.useEffect(
    function registerShortcuts() {
      const shortcuts = Object.values(shortcutMap);
      const disposeShortcuts = addGlobalShortcuts(shortcuts);
      return disposeShortcuts;
    },
    [addGlobalShortcuts, shortcutMap],
  );

  const registerResult: RegisterShortcutsResultMap<any> = {};
  for (const [shortcutName, shortcut] of Object.entries(shortcutMap)) {
    const shortcutRegisterResult: RegisterShortcutsResult = { icon: undefined };
    if (shortcut.keybindings) {
      for (const keybinding of shortcut.keybindings) {
        if (
          keybinding.modifiers &&
          doesEventMatchKeybindingModifiers(activeModifiers, keybinding.modifiers)
        ) {
          shortcutRegisterResult.icon = KEY_TO_VISUALIZATION_MAP[keybinding.key];
        }
      }
    }
    registerResult[shortcutName] = shortcutRegisterResult;
  }

  return registerResult as RegisterShortcutsResultMap<ActualShortcutMap>;
}
