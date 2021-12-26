import { useDialog } from '@react-aria/dialog';
import {
  useOverlay,
  useOverlayTrigger,
  useOverlayPosition,
  useModal,
  DismissButton,
  OverlayContainer,
} from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import { OverlayTriggerState, useOverlayTriggerState } from '@react-stately/overlays';
import { AriaButtonProps } from '@react-types/button';
import { PositionProps } from '@react-types/overlays';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';

import { functions } from '@app/base/utils/functions.util';
import { Box } from '@app/ui/components-library/Box';
import { useFramerMotionAnimations } from '@app/ui/components-library/DesignTokenContext';
import { FocusScope } from '@app/ui/components-library/FocusScope';

export { OverlayProvider } from '@react-aria/overlays';

type UsePopoverArgs<TriggerHTMLElement extends HTMLElement> = {
  triggerRef: React.RefObject<TriggerHTMLElement>;
  popover?: {
    placement?: PositionProps['placement'];
  };
};

type UsePopoverReturnType = {
  triggerProps: AriaButtonProps<any>;
  popoverInstance: PopoverInstance;
};

export type PopoverInstance = {
  popoverRef: React.RefObject<HTMLDivElement>;
  popoverDomProps: React.HTMLAttributes<HTMLElement>;
  state: OverlayTriggerState;
};

export function usePopover<TriggerHTMLElement extends HTMLElement>(
  props: UsePopoverArgs<TriggerHTMLElement>,
): UsePopoverReturnType {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const state = useOverlayTriggerState({});
  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    props.triggerRef,
  );

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { overlayProps: positionProps, updatePosition } = useOverlayPosition({
    targetRef: props.triggerRef,
    overlayRef: popoverRef,
    placement: props.popover?.placement ?? 'bottom',
    offset: 0,
    isOpen: state.isOpen,
  });

  React.useEffect(
    function updatePositionOnTargetMovement() {
      if (props.triggerRef.current && state.isOpen) {
        const throttledUpdatePosition = functions.throttle(updatePosition, 20);
        const mutationObserver = new MutationObserver(throttledUpdatePosition);
        mutationObserver.observe(props.triggerRef.current, { attributes: true });
        return () => mutationObserver.disconnect();
      }
    },
    [props.triggerRef, state.isOpen, updatePosition],
  );

  return {
    triggerProps: triggerProps as AriaButtonProps<any>,
    popoverInstance: {
      popoverRef,
      popoverDomProps: mergeProps(overlayProps, positionProps),
      state,
    },
  };
}

type PopoverProps = PopoverComponentProps &
  Omit<React.ComponentPropsWithoutRef<'div'>, keyof PopoverComponentProps>;

type PopoverComponentProps = {
  children: React.ReactNode;
  popoverInstance: PopoverInstance;
  hideBackdrop?: boolean;
};

export const Popover = styled((props: PopoverProps) => {
  const { popoverInstance } = props;

  return (
    <AnimatePresence>{popoverInstance.state.isOpen && <PopoverInner {...props} />}</AnimatePresence>
  );
})``;

const PopoverInner = styled((props: PopoverProps) => {
  const {
    /* component props */
    children,
    popoverInstance,
    hideBackdrop,

    /* other props */
    ...delegatedProps
  } = props;

  function onClose() {
    popoverInstance.state.close();
  }

  const { overlayProps } = useOverlay(
    {
      onClose,
      isOpen: popoverInstance.state.isOpen,
      isDismissable: true,
    },
    popoverInstance.popoverRef,
  );
  const { modalProps } = useModal();
  const { dialogProps } = useDialog({}, popoverInstance.popoverRef);

  const framerMotionAnimations = useFramerMotionAnimations();

  return (
    <OverlayContainer style={{ isolation: 'isolate' }}>
      <FocusScope contain autoFocus restoreFocus>
        {!hideBackdrop && (
          <PopoverBackdrop onClick={onClose} {...framerMotionAnimations.fadeInOut} />
        )}
        <Box
          {...mergeProps(
            overlayProps,
            dialogProps,
            popoverInstance.popoverDomProps,
            modalProps,
            delegatedProps,
          )}
          {...framerMotionAnimations.fadeInOut}
          ref={popoverInstance.popoverRef}
        >
          {children}
          <DismissButton onDismiss={onClose} />
        </Box>
      </FocusScope>
    </OverlayContainer>
  );
})``;

const PopoverBackdrop = styled(Box)`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.34);
`;
