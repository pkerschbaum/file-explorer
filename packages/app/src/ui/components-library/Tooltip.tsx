import { OverlayContainer, useOverlayPosition } from '@react-aria/overlays';
import {
  TooltipTriggerAria,
  useTooltip as useReactAriaTooltip,
  useTooltipTrigger,
} from '@react-aria/tooltip';
import { mergeProps } from '@react-aria/utils';
import { TooltipTriggerState, useTooltipTriggerState } from '@react-stately/tooltip';
import { Placement as ReactAriaPlacement, PlacementAxis } from '@react-types/overlays';
import { TooltipTriggerProps } from '@react-types/tooltip';
import { AnimatePresence } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { commonStyles } from '@app/ui/common-styles';
import { Box } from '@app/ui/components-library/Box';
import { useFramerMotionAnimations } from '@app/ui/components-library/DesignTokenContext';
import { useUpdatePositionOnAnchorMovement } from '@app/ui/components-library/overlay';

export type Placement = ReactAriaPlacement;

export type UseTooltipArgs<
  TriggerHTMLElement extends HTMLElement,
  AnchorHTMLElement extends HTMLElement,
> = {
  triggerRef: React.RefObject<TriggerHTMLElement>;
  anchorRef?: React.RefObject<AnchorHTMLElement>;
  tooltip?: {
    isOpen?: boolean;
    placement?: Placement;
    offset?: {
      mainAxis?: number;
    };
  };
};

type UseTooltipReturnType = {
  triggerProps: TooltipTriggerAria['triggerProps'];
  tooltipInstance: TooltipInstance;
};

type TooltipInstance = {
  tooltipRef: React.RefObject<HTMLDivElement>;
  tooltipDomProps: React.HTMLAttributes<HTMLElement>;
  tooltipArrowDomProps: React.HTMLAttributes<HTMLElement>;
  tooltipActualPlacement: PlacementAxis;
  state: TooltipTriggerState;
};

export function useTooltip<
  TriggerHTMLElement extends HTMLElement,
  AnchorHTMLElement extends HTMLElement,
>(props: UseTooltipArgs<TriggerHTMLElement, AnchorHTMLElement>): UseTooltipReturnType {
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  const tooltipTriggerProps: TooltipTriggerProps = { delay: 0 };
  const state = useTooltipTriggerState(tooltipTriggerProps);
  const isOpen = props.tooltip?.isOpen ?? state.isOpen;
  const { triggerProps, tooltipProps: reactAriaTooltipProps } = useTooltipTrigger(
    { ...tooltipTriggerProps, isOpen },
    { ...state, isOpen },
    props.triggerRef,
  );

  const anchorRef = props.anchorRef ?? props.triggerRef;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    overlayProps: positionProps,
    arrowProps,
    placement,
    updatePosition,
  } = useOverlayPosition({
    targetRef: anchorRef,
    overlayRef: tooltipRef,
    placement: props.tooltip?.placement ?? 'bottom',
    offset: props.tooltip?.offset?.mainAxis ?? 0,
    isOpen,
    containerPadding: 0,
  });

  useUpdatePositionOnAnchorMovement({
    anchorElem: anchorRef.current,
    isOpen: state.isOpen,
    updatePosition,
  });

  return {
    triggerProps,
    tooltipInstance: {
      tooltipRef,
      tooltipDomProps: mergeProps(reactAriaTooltipProps, positionProps),
      tooltipArrowDomProps: arrowProps,
      tooltipActualPlacement: placement,
      state,
    },
  };
}

export type TooltipProps = TooltipComponentProps &
  Pick<React.ComponentPropsWithoutRef<'div'>, 'className'>;

type TooltipComponentProps = {
  tooltipInstance: TooltipInstance;
  overrideIsOpen?: boolean;
  children: React.ReactNode;
};

export const Tooltip = styled((props: TooltipProps) => {
  const { tooltipInstance, overrideIsOpen } = props;

  return (
    <AnimatePresence>
      {(overrideIsOpen ?? tooltipInstance.state.isOpen) && <TooltipInner {...props} />}
    </AnimatePresence>
  );
})``;

const TooltipInner = styled((props: TooltipProps) => {
  const {
    /* component props */
    tooltipInstance,
    overrideIsOpen,
    children,

    /* other props */
    ...delegatedProps
  } = props;

  const isOpen = overrideIsOpen ?? tooltipInstance.state.isOpen;
  const { tooltipProps } = useReactAriaTooltip({ isOpen }, { ...tooltipInstance.state, isOpen });

  const framerMotionAnimations = useFramerMotionAnimations();

  return (
    <OverlayContainer style={{ isolation: 'isolate' }}>
      <TooltipRoot
        ref={tooltipInstance.tooltipRef}
        {...framerMotionAnimations.fadeInOut}
        {...mergeProps(delegatedProps, tooltipInstance.tooltipDomProps, tooltipProps)}
      >
        <TooltipArrow {...tooltipInstance.tooltipArrowDomProps} styleProps={props} />
        <TooltipContent>{children}</TooltipContent>
      </TooltipRoot>
    </OverlayContainer>
  );
})``;

type StyleProps = TooltipProps;

const TooltipRoot = styled(Box)`
  max-height: 100vh;
  max-width: 100vw;
  padding: var(--spacing-1) var(--spacing-2);
  display: flex;
  flex-direction: column;

  --border-to-use: 1px solid var(--color-bg-3);
  color: var(--color-fg);
  background-color: var(--color-bg-2);
  border: var(--border-to-use);
  border-radius: var(--border-radius-4);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.26);
`;

const TooltipArrow = styled(Box)<{ styleProps: StyleProps }>`
  position: absolute;

  /* 
    Computation of arrow size, offsets, transforms and borders is based on
     - https://popper.js.org/react-popper/v2/hook/
     - https://popper.js.org/docs/v2/tutorial/
     - https://github.com/intergalacticspacehighway/react-native-popper/blob/e08f2ca08ca968e46fa6d88e236464c94c0fc0f6/src/Popper/Popper.tsx#L195-L244 
   */
  --arrow-size: 12px;
  --arrow-offset-to-apply: calc(-1 * var(--arrow-size) / 2 - 1px);

  width: var(--arrow-size);
  height: var(--arrow-size);
  background: inherit;

  visibility: hidden;

  ${({ styleProps }) => {
    if (styleProps.tooltipInstance.tooltipActualPlacement === 'top') {
      return css`
        bottom: var(--arrow-offset-to-apply);
        transform: translateX(var(--arrow-offset-to-apply));
        &::before {
          border-right: var(--border-to-use);
          border-bottom: var(--border-to-use);
        }
      `;
    } else if (styleProps.tooltipInstance.tooltipActualPlacement === 'bottom') {
      return css`
        top: var(--arrow-offset-to-apply);
        transform: translateX(var(--arrow-offset-to-apply));
        &::before {
          border-left: var(--border-to-use);
          border-top: var(--border-to-use);
        }
      `;
    } else if (styleProps.tooltipInstance.tooltipActualPlacement === 'left') {
      return css`
        right: var(--arrow-offset-to-apply);
        transform: translateY(var(--arrow-offset-to-apply));
        &::before {
          border-top: var(--border-to-use);
          border-right: var(--border-to-use);
        }
      `;
    } else if (styleProps.tooltipInstance.tooltipActualPlacement === 'right') {
      return css`
        left: var(--arrow-offset-to-apply);
        transform: translateY(var(--arrow-offset-to-apply));
        &::before {
          border-bottom: var(--border-to-use);
          border-left: var(--border-to-use);
        }
      `;
    }
  }}

  &::before {
    position: absolute;
    width: var(--arrow-size);
    height: var(--arrow-size);
    background: inherit;

    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }
`;

const TooltipContent = styled(Box)`
  /* 
     Apply "position:relative" because otherwise, the arrow is _in front of_ the content box 
     (instead of _behind_ the content box). This is caused by the arrow being absolutely positioned, 
     and "As a general rule, positioned elements will always render on top of non-positioned ones."
     (cited from https://courses.joshwcomeau.com/css-for-js/02-rendering-logic-2/07-stacking-contexts)
   */
  position: relative;

  ${commonStyles.layout.flex.shrinkAndFitVertical}
  display: flex;
  flex-direction: column;
`;
