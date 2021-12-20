/**
 * The GlobalShortcutContext allows to register shortcuts which are activated on the "keydown" event
 * in the capture phase.
 *
 * If the user navigates from one interactive HTML element to the next one using {Tab} or {Shift+Tab},
 * keydown events should NOT be overridden. Otherwise, the user would not be able to control the web
 * application via keyboard because global shortcuts could interfere.
 * E.g. the user might want to activate a button using {Enter}, but there is a shortcut registered
 * for {Enter} to open the currently selected folder.
 *
 * That's why we track whether at least one element in the app currently has focus, and if so, we
 * disable all shortcuts.
 * To determine if some elements have focus, we query for the CSS class ".focus-visible".
 * This class is set by "focus-visible.js" (https://github.com/WICG/focus-visible) which is a polyfill
 * for the pseudo class ":focus-visible". It is set by the browser if a focus should be made evident
 * on the element, thus it is set if the element was focused by keyboard but it is NOT set if the element
 * was focused by click. Therefore, it's the ideal pseudo class to determine if the user navigated to
 * the event target via keyboard ({Tab} and {Shift+Tab}).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
 *
 * Exceptions for the aforementioned rule can be made by setting the attribute "data-global-shortcuts-enabled"
 * on an HTML element. This is e.g. used for the explorer filter component, since shortcuts should
 * still be active for that element (in order to allow rapid filtering/navigation via keyboard).
 */

import * as React from 'react';

import { objects } from '@app/base/utils/objects.util';
import { KEY_TO_VISUALIZATION_MAP } from '@app/ui/components-library/visual-key';
import { KEY } from '@app/ui/constants';
import { createContext } from '@app/ui/utils/react.util';

export const DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED = {
  datasetAttr: {
    'data-global-shortcuts-enabled': 'true',
  },
  attrCamelCased: 'globalShortcutsEnabled',
} as const;

export type ShortcutMap = {
  [shortcutName: string]: Shortcut;
};
type Shortcut = {
  keybindings?: Keybinding[];
  condition?: (e: WindowEventMap['keydown']) => boolean;
  handler: (e: WindowEventMap['keydown']) => void;
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

const isSomeElementBlockingShortcutsContext = createContext<boolean>(
  'IsSomeElementBlockingShortcuts',
);
const useIsSomeElementBlockingShortcutsContext =
  isSomeElementBlockingShortcutsContext.useContextValue;
const IsSomeElementBlockingShortcutsContextProvider =
  isSomeElementBlockingShortcutsContext.Provider;

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
  const [isSomeElementBlockingShortcuts, setIsSomeElementBlockingShortcuts] = React.useState(false);

  React.useEffect(
    /**
     * This effect listens for "focus" and "blur" events and stores a boolean "isSomeElementBlockingShortcuts"
     * in React state which indicates whether at least one element has currently focus (and thus,
     * shortcuts should be disabled) or not.
     *
     * In case a "blur" event fires, we want to hold for a moment and see whether the "blur" event is
     * immediately followed by a "focus" event. This is e.g. the case if the user navigates via TAB key
     * from one interactive element to the next one. We don't want to set
     * "isSomeElementBlockingShortcuts" state in between the blur and focus events - we would, for
     * just a moment, set "isSomeElementBlockingShortcuts" to false and thus trigger user-visible rerenders,
     * immediately followed by a "focus" event setting "isSomeElementBlockingShortcuts" to true and,
     * again, causing rerenders.
     * To avoid those unwanted rerenders, in case of a "blur" event we schedule the function call for
     * the update of the "isSomeElementBlockingShortcuts" in the event queue (via setTimeout). It is
     * guaranteed that any immediately following "focus" event will already be in the event queue and
     * thus, be processed *before* the scheduled update (https://stackoverflow.com/a/1378103/1700319).
     *
     * Also in case of "focus" events, the update of the "isSomeElementBlockingShortcuts" state is
     * scheduled via setTimeout.
     * The reason is that we do not use the browser native ":focus-visible" pseudo class to query for
     * focused elements, but the ".focus-visible" CSS class. This class is set by a polyfill "focus-visible.js"
     * (https://github.com/WICG/focus-visible). We need to use that polyfill because Jest DOM (jsdom)
     * does not support ":focus-visible".
     * But, that polyfilled ".focus-visible" CSS class is only set *after* the "focus" event
     * (https://github.com/WICG/focus-visible#how-it-works). So we have to schedule the update to wait
     * for the "focus" (and any other events) to get processed before we query for focused elements.
     */
    function storeInfoIfSomeElementIsBlockingShortcuts() {
      function updateIsElementBlockingShortcuts() {
        const focusedElements = document.querySelectorAll('*.focus-visible');
        const focusedElementsWhichShouldBlockShortcuts = Array.from(focusedElements).filter(
          (elem) =>
            elem instanceof HTMLElement &&
            elem.dataset[DATA_ATTRIBUTE_WINDOW_KEYDOWNHANDLERS_ENABLED.attrCamelCased] !== 'true',
        );
        setIsSomeElementBlockingShortcuts(focusedElementsWhichShouldBlockShortcuts.length > 0);
      }

      let blurTimeoutId: NodeJS.Timeout;
      const eventListener = (e: WindowEventMap['focus'] | WindowEventMap['blur']) => {
        if (e.type === 'focus') {
          if (blurTimeoutId) {
            /**
             * This "focus" event is immediately following a "blur" event.
             * Clear the update function call which was scheduled by the "blur" event.
             */
            clearTimeout(blurTimeoutId);
          }
          setTimeout(updateIsElementBlockingShortcuts, 0);
        } else {
          blurTimeoutId = setTimeout(updateIsElementBlockingShortcuts, 0);
        }
      };

      window.addEventListener('focus', eventListener, { capture: true });
      window.addEventListener('blur', eventListener, { capture: true });
      return () => {
        window.removeEventListener('focus', eventListener, { capture: true });
        window.removeEventListener('blur', eventListener, { capture: true });
      };
    },
    [],
  );

  React.useEffect(
    function invokeShortcutOnKeydown() {
      const eventListener = (e: WindowEventMap['keydown']) => {
        if (!shouldEventGetProcessed(e, isSomeElementBlockingShortcuts)) {
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
          e.stopPropagation();
        }
      };

      window.addEventListener('keydown', eventListener, { capture: true });
      return () => window.removeEventListener('keydown', eventListener, { capture: true });
    },
    [isSomeElementBlockingShortcuts],
  );

  React.useEffect(function setModifiersOnKeydownAndKeyup() {
    const eventListener = (e: WindowEventMap['keydown'] | WindowEventMap['keyup']) => {
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

    window.addEventListener('keydown', eventListener, { capture: true });
    window.addEventListener('keyup', eventListener, { capture: true });
    return () => {
      window.removeEventListener('keydown', eventListener, { capture: true });
      window.removeEventListener('keyup', eventListener, { capture: true });
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
        <IsSomeElementBlockingShortcutsContextProvider value={isSomeElementBlockingShortcuts}>
          {memoizedChildren}
        </IsSomeElementBlockingShortcutsContextProvider>
      </ActiveModifiersContextProvider>
    </AddGlobalShortcutsContextProvider>
  );
};

function shouldEventGetProcessed(
  e: WindowEventMap['keydown'] | WindowEventMap['keyup'],
  isFocusSomewhereVisible: boolean,
) {
  return e.target instanceof HTMLElement && !e.repeat && !isFocusSomewhereVisible;
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
  const isFocusSomewhereVisible = useIsSomeElementBlockingShortcutsContext();

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
    if (!isFocusSomewhereVisible && shortcut.keybindings) {
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

function doesEventMatchKeybindingModifiers(
  activeModifiers: Modifiers,
  keybindingModifiers: Modifiers,
): boolean {
  let matches = true;

  matches = matches && keybindingModifiers.ctrl === activeModifiers.ctrl;
  matches = matches && keybindingModifiers.alt === activeModifiers.alt;

  return matches;
}
