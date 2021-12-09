import { Placement } from '@popperjs/core';
import { useTooltip as useReactAriaTooltip, useTooltipTrigger } from '@react-aria/tooltip';
import { mergeProps } from '@react-aria/utils';
import { TooltipTriggerState, useTooltipTriggerState } from '@react-stately/tooltip';
import { AriaTooltipProps, TooltipTriggerProps } from '@react-types/tooltip';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { Box } from '@app/ui/components-library/Box';

type UseTooltipArgs<
  TriggerHTMLElement extends HTMLElement,
  AnchorHTMLElement extends HTMLElement,
> = {
  triggerRef: React.RefObject<TriggerHTMLElement>;
  anchorRef: React.RefObject<AnchorHTMLElement>;
};

export function useTooltip<
  TriggerHTMLElement extends HTMLElement,
  AnchorHTMLElement extends HTMLElement,
>({ triggerRef, anchorRef }: UseTooltipArgs<TriggerHTMLElement, AnchorHTMLElement>) {
  const props: TooltipTriggerProps = { delay: 0 };
  const state = useTooltipTriggerState(props);
  const { triggerProps, tooltipProps: reactAriaTooltipProps } = useTooltipTrigger(
    props,
    state,
    triggerRef,
  );

  const tooltipProps = {
    state,
    anchorRef,
    ...reactAriaTooltipProps,
  };

  return {
    triggerProps,
    tooltipProps,
  };
}

export type TooltipProps = AriaTooltipProps &
  Pick<React.HTMLProps<HTMLDivElement>, 'className'> &
  TooltipComponentProps;

type TooltipComponentProps = {
  state: TooltipTriggerState;
  anchorRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
  placement?: Placement;
};

const TooltipBase: React.FC<TooltipProps> = (props) => {
  const {
    /* component props */
    anchorRef,
    children,
    placement = 'bottom',

    /* html props */
    className,

    /* react-aria props */
    state,
    ...ariaTooltipProps
  } = props;
  const htmlProps = { className };

  const { tooltipProps } = useReactAriaTooltip(ariaTooltipProps, state);

  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = React.useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(anchorRef.current, popperElement, {
    placement,
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      {
        name: 'offset',
        options: { offset: [0, 10] },
      },
    ],
  });

  const bodyElement = React.useMemo(() => document.querySelector('body'), []);

  if (!state.isOpen) {
    return null;
  }

  invariant(bodyElement);

  return ReactDOM.createPortal(
    <Box
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      {...mergeProps(htmlProps, ariaTooltipProps, tooltipProps)}
    >
      <TooltipArrow ref={setArrowElement} style={styles.arrow} />
      <TooltipContent>{children}</TooltipContent>
    </Box>,
    bodyElement,
  );
};

export const Tooltip = styled(TooltipBase)`
  padding: var(--spacing-1) var(--spacing-2);

  --border-to-use: 1px solid var(--color-bg-3);
  color: var(--color-fg);
  background-color: var(--color-bg-2);
  border: var(--border-to-use);
  border-radius: var(--border-radius-4);
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.26);
`;

const TooltipArrow = styled(Box)`
  /* based on https://popper.js.org/react-popper/v2/hook/ and https://popper.js.org/docs/v2/tutorial/ */
  --arrow-size: 12px;
  --arrow-offset-to-apply: calc(-1 * var(--arrow-size) / 2);

  width: var(--arrow-size);
  height: var(--arrow-size);
  background: inherit;

  visibility: hidden;

  ${Tooltip}[data-popper-placement^='top'] > & {
    bottom: var(--arrow-offset-to-apply);
    &::before {
      border-right: var(--border-to-use);
      border-bottom: var(--border-to-use);
    }
  }
  ${Tooltip}[data-popper-placement^='bottom'] > & {
    top: var(--arrow-offset-to-apply);
    &::before {
      border-left: var(--border-to-use);
      border-top: var(--border-to-use);
    }
  }
  ${Tooltip}[data-popper-placement^='left'] > & {
    right: var(--arrow-offset-to-apply);
    &::before {
      border-top: var(--border-to-use);
      border-right: var(--border-to-use);
    }
  }
  ${Tooltip}[data-popper-placement^='right'] > & {
    left: var(--arrow-offset-to-apply);
    &::before {
      border-bottom: var(--border-to-use);
      border-left: var(--border-to-use);
    }
  }

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
`;
