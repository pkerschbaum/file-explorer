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

import { Box } from '@app/ui/components-library/Box';
import { FocusScope } from '@app/ui/components-library/FocusScope';
import { framerMotionAnimation } from '@app/ui/utils/animations';

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

  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: props.triggerRef,
    overlayRef: popoverRef,
    placement: props.popover?.placement ?? 'bottom',
    offset: 0,
    isOpen: state.isOpen,
  });

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

  return (
    <OverlayContainer style={{ isolation: 'isolate' }}>
      <FocusScope contain autoFocus restoreFocus>
        {!hideBackdrop && (
          <PopoverBackdrop onClick={onClose} {...framerMotionAnimation.fadeInOut} />
        )}
        <Box
          {...mergeProps(
            overlayProps,
            dialogProps,
            popoverInstance.popoverDomProps,
            modalProps,
            delegatedProps,
          )}
          {...framerMotionAnimation.fadeInOut}
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
