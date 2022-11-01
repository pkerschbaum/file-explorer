import invariant from 'tiny-invariant';

export const functions = {
  noop,
  debounce,
  throttle,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

type DebounceResult<ThisType, Params extends any[]> = [
  (this: ThisType, ...params: Params) => unknown,
  () => void,
];

function debounce<ThisType, Params extends any[]>(
  fn: (this: ThisType, ...params: Params) => unknown,
  limit: number,
): DebounceResult<ThisType, Params> {
  let lastFnInvocation: undefined | (() => void) = undefined;
  let scheduledTimeoutId: undefined | NodeJS.Timeout = undefined;

  function runAndClearScheduledFnInvocation() {
    if (!scheduledTimeoutId) {
      return;
    }
    clearTimeout(scheduledTimeoutId);
    scheduledTimeoutId = undefined;

    invariant(lastFnInvocation);
    try {
      lastFnInvocation();
    } finally {
      lastFnInvocation = undefined;
    }
  }

  const debouncedFunction = function (this: ThisType, ...params: Params): void {
    if (scheduledTimeoutId) {
      clearTimeout(scheduledTimeoutId);
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    lastFnInvocation = () => fn.apply(that, params);
    scheduledTimeoutId = setTimeout(runAndClearScheduledFnInvocation, limit);
  };

  return [debouncedFunction, runAndClearScheduledFnInvocation];
}

type ThrottleResult<ThisType, Params extends any[]> = [
  (this: ThisType, ...params: Params) => unknown,
  () => void,
];

// based on "non-configurable version" from https://stackoverflow.com/a/27078401/1700319
function throttle<ThisType, Params extends any[]>(
  fn: (this: ThisType, ...params: Params) => unknown,
  limit: number,
): ThrottleResult<ThisType, Params> {
  let lastDiscardedFnInvocation: undefined | (() => void) = undefined;
  let scheduledTimeoutId: undefined | NodeJS.Timeout = undefined;

  function finishThrottleWindowAndExecuteTrailingCall() {
    if (!scheduledTimeoutId) {
      return;
    }
    clearTimeout(scheduledTimeoutId);
    scheduledTimeoutId = undefined;

    /**
     * If there was a function invocation which was discarded because throttle was active,
     * execute a "trailing call", i.e. execute that function invocation now.
     *
     * Imagine a popover "follows" a moving target by updating its position via a throttled
     * "updatePosition" function and a relatively high "limit" set. If we would not execute the
     * last discarded function invocation, the "updatePosition" invocation which would put the
     * popover in its final position (after the target stopped moving) would not execute -
     * the popover would just "hang" in a wrong position.
     */
    if (lastDiscardedFnInvocation) {
      try {
        lastDiscardedFnInvocation();
      } finally {
        lastDiscardedFnInvocation = undefined;
      }
    }
  }

  const throttledFunction = function (this: ThisType, ...params: Params): void {
    if (!scheduledTimeoutId) {
      try {
        fn.apply(this, params);
      } finally {
        scheduledTimeoutId = setTimeout(finishThrottleWindowAndExecuteTrailingCall, limit);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this;
      lastDiscardedFnInvocation = () => fn.apply(that, params);
    }
  };

  return [throttledFunction, finishThrottleWindowAndExecuteTrailingCall];
}
