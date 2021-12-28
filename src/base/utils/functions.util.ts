export const functions = {
  noop,
  throttle,
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

// based on "non-configurable version" from https://stackoverflow.com/a/27078401/1700319
function throttle<ThisType, Params extends any[]>(
  fn: (this: ThisType, ...params: Params) => unknown,
  limit: number,
) {
  let scheduledTimeoutId: NodeJS.Timeout | undefined = undefined;
  let paramsOflastDiscardedInvocation: undefined | { that: ThisType; params: Params };

  function runTimeout() {
    if (scheduledTimeoutId === undefined) {
      return;
    }

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
    if (paramsOflastDiscardedInvocation) {
      fn.apply(paramsOflastDiscardedInvocation.that, paramsOflastDiscardedInvocation.params);
    }
  }

  const throttledFunction = function (this: ThisType, ...params: Params): void {
    if (scheduledTimeoutId === undefined) {
      scheduledTimeoutId = setTimeout(runTimeout, limit);
      fn.apply(this, params);
    } else {
      paramsOflastDiscardedInvocation = { that: this, params };
    }
  };

  const finishTrailingFnCall = runTimeout;

  return [throttledFunction, finishTrailingFnCall] as const;
}
