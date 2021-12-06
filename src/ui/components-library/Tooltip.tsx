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

type TooltipProps = AriaTooltipProps & {
  state: TooltipTriggerState;
  anchorRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
};

export const Tooltip: React.FC<TooltipProps> = ({ state, anchorRef, children, ...props }) => {
  const { tooltipProps } = useReactAriaTooltip(props, state);

  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(null);
  const [arrowElement, setArrowElement] = React.useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(anchorRef.current, popperElement, {
    modifiers: [
      { name: 'arrow', options: { element: arrowElement } },
      {
        name: 'offset',
        options: { offset: [0, 8] },
      },
    ],
  });

  const bodyElement = React.useMemo(() => document.querySelector('body'), []);

  if (!state.isOpen) {
    return null;
  }

  invariant(bodyElement);

  return ReactDOM.createPortal(
    <TooltipContainer
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      {...mergeProps(props, tooltipProps)}
    >
      <TooltipArrow ref={setArrowElement} style={styles.arrow} />
      <TooltipContent>{children}</TooltipContent>
    </TooltipContainer>,
    bodyElement,
  );
};

const TooltipContainer = styled(Box)`
  isolation: isolate;

  --padding-block: var(--spacing-1);
`;

const TooltipContent = styled(Box)`
  padding: var(--padding-block) var(--spacing-2);

  color: var(--color-fg-contrast);
  background-color: var(--color-bg-contrast);
  border-radius: var(--border-radius-2);
  box-shadow: var(--shadow-elevation-16);
`;

const TooltipArrow = styled(Box)`
  /* adapted based on https://javascript.plainenglish.io/usepopper-with-styled-components-for-react-react-popper-2-568284d029bf */
  --size: 10px;
  height: var(--size);
  width: var(--size);

  &:after {
    content: ' ';
    position: absolute;
    top: calc(var(--padding-block) * -1);
    transform: rotate(45deg);
    width: var(--size);
    height: var(--size);
    background-color: var(--color-bg-contrast);
  }
`;
