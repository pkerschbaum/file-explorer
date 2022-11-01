import { functions } from '@app/base/utils/functions.util';

describe('functions.util', () => {
  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('debounced function should run after the debounce timeout passed', () => {
      let currentVal = 0;
      function incrementVal() {
        currentVal += 1;
      }
      const [debouncedIncrementVal] = functions.debounce(incrementVal, 100);

      // invoke debounced function
      debouncedIncrementVal();

      // value should still be the initial value
      expect(currentVal).toEqual(0);

      // advance time but not enough to trigger debounced function
      jest.advanceTimersByTime(99);
      expect(currentVal).toEqual(0);

      // advance time again, now the function should be triggered
      jest.advanceTimersByTime(1);
      expect(currentVal).toEqual(1);

      // run all pending timers. since there should be no pending debounced function call, the value should stay the same
      jest.runAllTimers();
      expect(currentVal).toEqual(1);
    });

    it('if a second function invocation occurs within the debounce timeframe, it should start a new debounce', () => {
      let currentVal = 0;
      function incrementVal() {
        currentVal += 1;
      }
      const [debouncedIncrementVal] = functions.debounce(incrementVal, 100);

      // invoke debounced function
      debouncedIncrementVal();

      // value should still be the initial value
      expect(currentVal).toEqual(0);

      // advance time but not enough to trigger debounced function
      jest.advanceTimersByTime(99);
      expect(currentVal).toEqual(0);

      // invoke debounced function again. this should start a new debounce timeframe
      debouncedIncrementVal();

      // advance time again. The debounced function should not fire since the debounce timeframe was started again
      jest.advanceTimersByTime(1);
      expect(currentVal).toEqual(0);
    });

    it('running the debounced function immediately should be possible and clear any pending debounced function invocation', () => {
      let currentVal = 0;
      function setVal(newVal: number) {
        currentVal = newVal;
      }
      const [debouncedIncrementVal, runDebouncedIncrementValNow] = functions.debounce(setVal, 100);

      // invoke debounced function
      debouncedIncrementVal(1);

      // value should still be the initial value
      expect(currentVal).toEqual(0);

      // run the debounced function immediately
      runDebouncedIncrementValNow();
      expect(currentVal).toEqual(1);

      /**
       * advance the time, and put a second function invocation in a new timeframe. The new function
       * call should only run after the debounce timeframe
       */
      jest.advanceTimersByTime(50);
      debouncedIncrementVal(2);
      jest.advanceTimersByTime(50);
      expect(currentVal).toEqual(1);
      jest.advanceTimersByTime(50);
      expect(currentVal).toEqual(2);
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('throttled function should run only once within the throttle timeframe', () => {
      let currentVal = 0;
      function incrementVal() {
        currentVal += 1;
      }
      const [throttledIncrementVal] = functions.throttle(incrementVal, 100);

      // invoke throttled function
      throttledIncrementVal();
      expect(currentVal).toEqual(1);

      // invoke throttled function multiple times again. the function should not run since we are still in the first timeframe
      throttledIncrementVal();
      throttledIncrementVal();
      throttledIncrementVal();
      expect(currentVal).toEqual(1);
    });

    it('after the throttle timeout passed, the last invocation should run and new function calls should be allowed', () => {
      let currentVal = 0;
      function incrementVal() {
        currentVal += 1;
      }
      const [throttledIncrementVal] = functions.throttle(incrementVal, 100);

      // invoke throttled function two times. the first invocation should run immediately, the second one should get "stored" for later
      throttledIncrementVal();
      throttledIncrementVal();
      expect(currentVal).toEqual(1);

      // advance time but not enough to enter next throttle timeframe
      jest.advanceTimersByTime(99);
      expect(currentVal).toEqual(1);

      /**
       * Advance time again.
       * Since the specific implementation runs trailing function invocations, the second function invocation
       * from before should have been run now.
       * Also, it should be able to invoke the function again.
       */
      jest.advanceTimersByTime(1);
      expect(currentVal).toEqual(2);
      throttledIncrementVal();
      throttledIncrementVal();
      throttledIncrementVal();
      expect(currentVal).toEqual(3);
    });
  });
});
