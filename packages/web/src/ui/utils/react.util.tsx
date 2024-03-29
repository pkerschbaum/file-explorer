import { functions } from '@pkerschbaum/commons-ecma/util/functions';
import type { FunctionType } from '@pkerschbaum/commons-ecma/util/types';
import * as React from 'react';
import * as useContextSelectorLib from 'use-context-selector';

import type { Event } from '@file-explorer/code-oss-ecma/event';

export type EventHandler<E extends keyof WindowEventMap> = {
  condition: (e: WindowEventMap[E]) => boolean;
  handler: (e: WindowEventMap[E]) => void;
  continuePropagation?: boolean;
};

export function useWindowEvent<E extends keyof WindowEventMap>(
  event: E,
  eventHandlers: EventHandler<E>[],
) {
  React.useEffect(() => {
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

// based on https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export function usePrevious<T>(value: T) {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// based on https://usehooks.com/useDebounce/
export function useDebouncedValue<T>(value: T, delay: number): T {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      /*
       * Cancel the timeout if value changes (also on delay change or unmount)
       * This is how we prevent debounced value from updating if value is changed ...
       * .. within the delay period. Timeout gets cleared and restarted.
       */
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export function useDebounceFn<ThisType, Params extends any[]>(
  fn: (this: ThisType, ...params: Params) => unknown,
  limit: number,
) {
  const [debouncedFn, runAndClearScheduledFnInvocation] = React.useMemo(
    () => functions.debounce(fn, limit),
    [fn, limit],
  );

  React.useEffect(
    function finishDebounceOnUnmount() {
      return () => runAndClearScheduledFnInvocation();
    },
    [runAndClearScheduledFnInvocation],
  );

  return debouncedFn;
}

export function useThrottleFn<ThisType, Params extends any[]>(
  fn: (this: ThisType, ...params: Params) => unknown,
  limit: number,
) {
  const [throttledFn, finishThrottleWindowAndExecuteTrailingCall] = React.useMemo(
    () => functions.throttle(fn, limit),
    [fn, limit],
  );

  React.useEffect(
    function finishThrottleOnUnmount() {
      return () => finishThrottleWindowAndExecuteTrailingCall();
    },
    [finishThrottleWindowAndExecuteTrailingCall],
  );

  return throttledFn;
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
    children: React.ReactNode;
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
export function useLatestValueRef<T>(value: T) {
  const valueRef = React.useRef<T>(value);

  React.useLayoutEffect(() => {
    valueRef.current = value;
  });

  return valueRef;
}

export function useRunCallbackOnMount(callback: FunctionType<[], void>) {
  const latestCallbackRef = useLatestValueRef(callback);
  React.useEffect(() => {
    const latestCallback = latestCallbackRef.current;
    latestCallback();
  }, [latestCallbackRef]);
}

export function useRunCallbackOnUnmount(callback: FunctionType<[], void>) {
  const latestCallbackRef = useLatestValueRef(callback);
  React.useEffect(() => {
    const latestCallback = latestCallbackRef.current;
    return () => latestCallback();
  }, [latestCallbackRef]);
}

/**
 * https://stackoverflow.com/a/53837442/1700319
 */
export function useForceUpdate() {
  const [_ignored, setValue] = React.useState(0);
  return React.useCallback(() => setValue((oldValue) => oldValue + 1), []);
}
