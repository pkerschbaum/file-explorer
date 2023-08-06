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
import type { OverlayTriggerState } from '@react-stately/overlays';
import { useOverlayTriggerState } from '@react-stately/overlays';
import type { AriaButtonProps } from '@react-types/button';
import type { PositionProps } from '@react-types/overlays';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { styled } from 'styled-components';

import { Backdrop } from '#pkg/ui/components-library/Backdrop';
import { Box } from '#pkg/ui/components-library/Box';
import { useFramerMotionAnimations } from '#pkg/ui/components-library/DesignTokenContext';
import { FocusScope } from '#pkg/ui/components-library/FocusScope';
import { useUpdatePositionOnAnchorMovement } from '#pkg/ui/components-library/overlay';

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

  const anchorRef = props.triggerRef;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { overlayProps: positionProps, updatePosition } = useOverlayPosition({
    targetRef: anchorRef,
    overlayRef: popoverRef,
    placement: props.popover?.placement ?? 'bottom',
    offset: 0,
    isOpen: state.isOpen,
  });

  useUpdatePositionOnAnchorMovement({
    anchorElem: anchorRef.current,
    isOpen: state.isOpen,
    updatePosition,
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
  disableAutoFocus?: boolean;
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
    disableAutoFocus,

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

  const innerContent = (
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
  );

  return (
    <OverlayContainer style={{ isolation: 'isolate' }}>
      <FocusScope contain autoFocus={!disableAutoFocus} restoreFocus>
        {hideBackdrop ? (
          innerContent
        ) : (
          <Backdrop onBackdropClick={onClose}>{innerContent}</Backdrop>
        )}
      </FocusScope>
    </OverlayContainer>
  );
})``;
