/* eslint-disable node/no-process-env */
import type { BrowserContext, PlaywrightTestArgs } from '@playwright/test';
import { expect } from '@playwright/test';
import { getDocument } from '@playwright-testing-library/test';
import path from 'node:path';
import * as sinon from 'sinon';

const WEB_APP_ORIGIN = process.env.WEB_APP_ORIGIN ?? 'localhost:6006';

declare global {
  // eslint-disable-next-line no-var
  var __clock: undefined | sinon.SinonFakeTimers;
  // eslint-disable-next-line no-var
  var getCountOfAnimatedElems: undefined | (() => number);
}

export async function bootstrap({
  page,
  storybookIdToVisit,
  enableAnimationsObserver,
}: {
  page: PlaywrightTestArgs['page'];
  storybookIdToVisit: string;
  enableAnimationsObserver?: boolean;
}) {
  await Promise.all([
    page.goto(
      `http://${WEB_APP_ORIGIN}/iframe.html?viewMode=story&args=&id=${storybookIdToVisit}`,
      { waitUntil: 'load' },
    ),
    page.waitForResponse(/fonts\/segoeui-vf.ttf/i),
  ]);
  const rootContainer = page.locator('#root > *');
  await expect(rootContainer).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);

  if (enableAnimationsObserver) {
    await page.evaluate(
      /**
       * This function will observe the whole page for events related to transitions/animations, and
       * keep a record of all elements which are currently animating.
       * An element is considered as "animating" if it receives a "transitionstart" or "animationstart"
       * event, and the animation is considered to be finished if the element receives a "transitionend",
       * "animationend", "transitioncancel" or "animationcancel" event.
       *
       * There is one catch though: if an element is removed from the DOM while it had a
       * transition/animation running, the browser will unfortunately *not* fire any of these events
       * - the element is just removed.
       * That's why in addition to the event listeners, a MutationObserver watches for DOM nodes to
       * get removed.
       */
      function registerAnimationsObserver() {
        const rootContainerElem = document.querySelector('#root');
        if (!rootContainerElem) {
          throw new Error(`could not find root container`);
        }

        // set up record of animated elements, functions, MutationObserver
        const mapOfAnimatedElems = new Map<EventTarget, true>();
        globalThis.getCountOfAnimatedElems = () => mapOfAnimatedElems.size;

        function addEventTargetToAnimatedElems(e: Event) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          mapOfAnimatedElems.set(e.target!, true);
        }

        function removeEventTargetFromAnimatedElems(e: Event) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          mapOfAnimatedElems.delete(e.target!);
        }

        const mutationObserver = new MutationObserver((mutations) => {
          const allRemovedNodes: Node[] = [];

          function collectNodeAndItsDescendents(node: Node) {
            allRemovedNodes.push(node);
            // eslint-disable-next-line unicorn/prefer-spread -- spread does not work for NodeListOf
            for (const childNode of Array.from(node.childNodes)) {
              collectNodeAndItsDescendents(childNode);
            }
          }

          for (const mutation of mutations) {
            // eslint-disable-next-line unicorn/prefer-spread -- spread does not work for NodeListOf
            for (const removedNode of Array.from(mutation.removedNodes)) {
              collectNodeAndItsDescendents(removedNode);
            }
          }

          for (const removedNode of allRemovedNodes) {
            mapOfAnimatedElems.delete(removedNode);
          }
        });

        // listen for the transition/animation events and start the MutationObserver
        const listenerOptions = { capture: true, passive: true };
        rootContainerElem.addEventListener(
          'transitionstart',
          addEventTargetToAnimatedElems,
          listenerOptions,
        );
        rootContainerElem.addEventListener(
          'transitionend',
          removeEventTargetFromAnimatedElems,
          listenerOptions,
        );
        rootContainerElem.addEventListener(
          'transitioncancel',
          removeEventTargetFromAnimatedElems,
          listenerOptions,
        );
        rootContainerElem.addEventListener(
          'animationstart',
          addEventTargetToAnimatedElems,
          listenerOptions,
        );
        rootContainerElem.addEventListener(
          'animationend',
          removeEventTargetFromAnimatedElems,
          listenerOptions,
        );
        rootContainerElem.addEventListener(
          'animationcancel',
          removeEventTargetFromAnimatedElems,
          listenerOptions,
        );
        mutationObserver.observe(rootContainerElem, { childList: true, subtree: true });
      },
    );
  }

  const $document = await getDocument(page);
  return $document;
}

export async function retrievePageScreenshot(page: PlaywrightTestArgs['page']) {
  await yieldToBrowser(page);
  return await page.screenshot();
}

/**
 * https://github.com/microsoft/playwright/issues/6347#issuecomment-965887758
 */
export async function enableFakeClock({ context }: { context: BrowserContext }) {
  const basePath = require.resolve('sinon');
  await context.addInitScript({
    path: path.join(basePath, '..', '..', 'pkg', 'sinon.js'),
  });
  // Auto-enable sinon right away
  await context.addInitScript(() => {
    window.__clock = sinon.useFakeTimers();
  });
}

export async function letBrowserUpdateStuffDependingOnClock(page: PlaywrightTestArgs['page']) {
  await page.evaluate(() => {
    if (!window.__clock) {
      throw new Error(
        `"letBrowserUpdateStuffDependingOnClock" should only be used in tests with fake clock enabled`,
      );
    }
  });
  await yieldToBrowser(page);
}

/**
 * Screenshots taken with the Playwright API `page.screenshot()` do sometimes not capture the final
 * state of the UI - it seems like taking the screenshot is sometimes so fast that React could not
 * finish updating the page before the screenshot is taken.
 *
 * The intent of this function `yieldToBrowser` is to not hard-code a timeout before taking screenshots
 * but instead, yielding to the browser and waiting for it to finish its work.
 *
 * `setTimeout` with a timeout of 0ms waits for all events currently present in the event queue to be
 * processed, and `requestIdleCallback` waits for the browser to become idle.
 */
async function yieldToBrowser(page: PlaywrightTestArgs['page']) {
  // eslint-disable-next-line no-restricted-syntax -- wait with 1ms timeout "yields" to the browser
  await page.waitForTimeout(1);
  await page.evaluate(() => {
    const p = new Promise((resolve) => setTimeout(resolve, 0));
    if (window.__clock) {
      window.__clock.tick(1000);
    }
    return p;
  });
  await page.evaluate(() => {
    const p = new Promise((resolve) => requestIdleCallback(resolve));
    if (window.__clock) {
      window.__clock.tick(1000);
    }
    return p;
  });
}

/**
 * Wait for all transitions and animations on the page to finish.
 *
 * It is necessary to call ``bootstrap`` with ``enableAnimationObserver`` set to true in order to use
 * this function.
 *
 * This function is necessary because in Chrome, if a CSS variable (CSS Custom Property) used for
 * foreground colors (`color`) changes its value, it takes some time that this new foreground color
 * "propagates" to all usages and until Chrome did paint all those changes.
 * If Playwright just continues in such a scenario and executes a Visual Regression test (via
 * `toMatchSnapshot()`), the test produces different visual results on repeated test runs --> the tests
 * are flaky.
 * Unfortunately, there seems to be no easy way to "wait" for the color propagation. But Chrome emits
 * transition events during the color changes, so this `waitForAnimations` function combined with the
 * "animation observer" of `bootstrap()` waits for all transitions to finish.
 */
export async function waitForAnimations({ page }: { page: PlaywrightTestArgs['page'] }) {
  await page.evaluate(() => {
    const TIMEOUT_WAIT_FOR_ANIMATIONS_TO_FINISH = 2000;
    const TIMEOUT_RESOLVE_IF_NO_ANIMATION_WAS_STARTED_AGAIN = 200;
    const INTERVAL_CHECK_IF_ANIMATIONS_ARE_FINISHED = 50;

    if (!globalThis.getCountOfAnimatedElems) {
      throw new Error(
        `waitForAnimations can only be used if the testcase's "bootstrap" function was called with "enableAnimationObserver" set to true`,
      );
    }

    const getCountOfAnimatedElems = globalThis.getCountOfAnimatedElems;

    return new Promise<void>((resolve, reject) => {
      function stopResolving() {
        if (resolveTimeoutId) {
          clearTimeout(resolveTimeoutId);
          resolveTimeoutId = undefined;
        }
      }
      function stopRejecting() {
        if (rejectTimeoutId) {
          clearTimeout(rejectTimeoutId);
          rejectTimeoutId = undefined;
        }
      }

      let resolveTimeoutId: undefined | NodeJS.Timeout;
      let rejectTimeoutId: undefined | NodeJS.Timeout;

      /**
       * Set up an interval which will periodically check if some elements are animating (and if none
       * is animating, schedule a setTimeout to finish the "waitForAnimations" promise).
       */
      const checkIfElemIsAnimatingIntervalId = setInterval(function checkIfSomeElemIsAnimating() {
        /**
         * If there is currently no element animating, schedule a setTimeout which will resolve the
         * "waitForAnimations" promise given that within the timeout, no element start to animate again.
         */
        if (getCountOfAnimatedElems() < 1 && resolveTimeoutId === undefined) {
          resolveTimeoutId = setTimeout(function resolvePromise() {
            stopRejecting();
            clearInterval(checkIfElemIsAnimatingIntervalId);
            resolve();
          }, TIMEOUT_RESOLVE_IF_NO_ANIMATION_WAS_STARTED_AGAIN);
        }

        /**
         * If there is at least one element animating, and there is a "resolveTimeout" scheduled,
         * clear that timeout.
         */
        if (getCountOfAnimatedElems() > 0 && resolveTimeoutId !== undefined) {
          stopResolving();
        }
      }, INTERVAL_CHECK_IF_ANIMATIONS_ARE_FINISHED);

      /**
       * Schedule a setTimeout which will reject the "waitForAnimations" promise if within the timeout
       * elements did not finish all animations.
       */
      rejectTimeoutId = setTimeout(function rejectPromise() {
        stopResolving();
        clearInterval(checkIfElemIsAnimatingIntervalId);
        reject(new Error('some element was still animating when timeout was reached'));
      }, TIMEOUT_WAIT_FOR_ANIMATIONS_TO_FINISH);
    });
  });
}
