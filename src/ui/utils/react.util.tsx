import { Event } from '@pkerschbaum/code-oss-file-service/out/vs/base/common/event';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import * as useContextSelectorLib from 'use-context-selector';

import { FunctionType } from '@app/base/utils/types.util';

type EventHandlers<E extends keyof WindowEventMap> = Array<{
  condition: (e: WindowEventMap[E]) => boolean;
  handler: (e: WindowEventMap[E]) => void;
  continuePropagation?: boolean;
}>;

export function useWindowEvent<E extends keyof WindowEventMap>(
  event: E,
  eventHandlers: EventHandlers<E> | null,
) {
  React.useEffect(() => {
    if (eventHandlers === null) {
      return;
    }

    const eventListener = (e: WindowEventMap[E]) => {
      const eventHandler = eventHandlers.find((handler) => handler.condition(e));
      if (eventHandler) {
        eventHandler.handler(e);
        if (!eventHandler.continuePropagation) {
          e.stopPropagation();
        }
      }
    };

    window.addEventListener(event, eventListener, { capture: true });
    return () => window.removeEventListener(event, eventListener, { capture: true });
  }, [event, eventHandlers]);
}

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export function usePrevious<T>(value: T) {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const useActionsWithDispatch = <T extends {}>(actions: T) => {
  // use type "Dispatch" just to clarify that dispatching is automatically done
  type Dispatch<FuncType> = FuncType;

  type DispatchType = {
    [P in keyof typeof actions]: Dispatch<typeof actions[P]>;
  };

  const dispatch = useDispatch<any>();

  const actionsWithDispatch: any = {};

  for (const action in actions) {
    if (Object.hasOwnProperty.call(actions, action)) {
      actionsWithDispatch[action] = (...args: any[]) => dispatch((actions as any)[action](...args));
    }
  }

  return actionsWithDispatch as DispatchType;
};

// https://usehooks.com/useDebounce/
export function useDebounce<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export function useRerenderOnEventFire<T>(event: Event<T>, shouldRerender: (value: T) => boolean) {
  const [, setCurrentVal] = React.useState(0);

  React.useEffect(
    function triggerRrenderIfNecessary() {
      const disposable = event((value) => {
        if (shouldRerender(value)) {
          setCurrentVal((oldVal) => oldVal + 1);
        }
      });
      return () => disposable.dispose();
    },
    [event, shouldRerender],
  );
}

const SYMBOL_CONTEXT_NOT_FOUND = Symbol('ContextNotFound');
type SYMBOL_CONTEXT_NOT_FOUND = typeof SYMBOL_CONTEXT_NOT_FOUND;

export function createContext<ContextValue>(name: string) {
  const Context = React.createContext<ContextValue | SYMBOL_CONTEXT_NOT_FOUND>(
    SYMBOL_CONTEXT_NOT_FOUND,
  );

  function useContextValue() {
    const valueOfContext = React.useContext(Context);
    if (valueOfContext === SYMBOL_CONTEXT_NOT_FOUND) {
      throw new Error(`${name} context is not available`);
    }
    return valueOfContext;
  }

  const Provider: React.FC<{
    children: React.ReactElement;
    value: ContextValue;
  }> = ({ children, value }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { useContextValue, Provider };
}

/**
 * Creates a React context using the library [use-context-selector](https://www.npmjs.com/package/use-context-selector) under-the-hood for better performance.
 */
export function createSelectableContext<ContextValue>(name: string) {
  const Context = useContextSelectorLib.createContext<ContextValue | SYMBOL_CONTEXT_NOT_FOUND>(
    SYMBOL_CONTEXT_NOT_FOUND,
  );

  function useContextSelector<Selected>(selector: (explorerValues: ContextValue) => Selected) {
    return useContextSelectorLib.useContextSelector(Context, (value) => {
      if (value === SYMBOL_CONTEXT_NOT_FOUND) {
        throw new Error(`${name} context is not available`);
      }
      return selector(value);
    });
  }

  const Provider: React.FC<{
    children: React.ReactNode;
    value: ContextValue;
  }> = ({ children, value }) => {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { useContextSelector, Provider };
}

/**
 * https://epicreact.dev/the-latest-ref-pattern-in-react/
 */
export function useLatestCallbackRef<T>(callback: T) {
  const callbackRef = React.useRef<T>(callback);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return callbackRef;
}

export function useRunCallbackOnUnmount(callback: FunctionType<[], void>) {
  const latestCallbackRef = useLatestCallbackRef(callback);
  React.useEffect(() => {
    const latestCallback = latestCallbackRef.current;
    return () => latestCallback();
  }, [latestCallbackRef]);
}
