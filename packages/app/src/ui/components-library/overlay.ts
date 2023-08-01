import * as React from 'react';

import { uiUtils } from '#pkg/ui/utils/ui.utils';

export function useUpdatePositionOnAnchorMovement({
  anchorElem,
  isOpen,
  updatePosition,
}: {
  anchorElem: null | HTMLElement;
  isOpen: boolean;
  updatePosition: () => void;
}) {
  React.useEffect(() => {
    if (!anchorElem || !isOpen) {
      return;
    }

    const cleanUpFns: Array<() => void> = [];

    let currentRAFHandle: undefined | number;
    function requestAnimationFrameToUpdatePosition() {
      if (currentRAFHandle) {
        // there is already a request for an animation frame pending --> return
        return;
      }

      // request an animation frame which will call updatePosition
      currentRAFHandle = requestAnimationFrame(() => {
        currentRAFHandle = undefined;
        updatePosition();
      });
    }
    cleanUpFns.push(() => {
      if (currentRAFHandle !== undefined) {
        cancelAnimationFrame(currentRAFHandle);
      }
    });

    /**
     * To detect size changes of the anchor element, use MutationObserver.
     */
    const mutationObserver = new MutationObserver(requestAnimationFrameToUpdatePosition);
    mutationObserver.observe(anchorElem, { attributes: true });
    cleanUpFns.push(() => mutationObserver.disconnect());

    /**
     * To detect position changes of the anchor element due to scrolling, lookup scrollable parent and
     * register listeners for the "scroll" event
     */
    const scrollableParent = uiUtils.getScrollParent(anchorElem);
    if (scrollableParent instanceof HTMLElement) {
      scrollableParent.addEventListener('scroll', requestAnimationFrameToUpdatePosition, {
        passive: true,
      });
      cleanUpFns.push(() =>
        scrollableParent.removeEventListener('scroll', requestAnimationFrameToUpdatePosition),
      );
    }

    return () => {
      for (const cleanUpFn of cleanUpFns) {
        cleanUpFn();
      }
    };
  }, [anchorElem, isOpen, updatePosition]);
}
