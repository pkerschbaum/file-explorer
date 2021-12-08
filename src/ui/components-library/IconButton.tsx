import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';

import { Tooltip, useTooltip } from '@app/ui/components-library/Tooltip';

type IconButtonProps = Pick<AriaButtonProps<'button'>, 'children' | 'onPress' | 'isDisabled'> &
  Pick<React.HTMLProps<HTMLButtonElement>, 'className' | 'onClick'> &
  IconButtonComponentProps;

type IconButtonComponentProps = {
  tooltipContent: React.ReactChild;
  size?: 'medium' | 'small';
};

const IconButtonBase = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButtonBaseWithRef(props, ref) {
    const {
      /* react-aria props */
      children,
      onPress,
      isDisabled,

      /* component props */
      tooltipContent,
      size: _ignored,

      /* html props */
      ...htmlProps
    } = props;
    const reactAriaProps = {
      children,
      onPress,
      isDisabled,
    };

    const buttonRef = useObjectRef(ref);
    const { buttonProps } = useButton(reactAriaProps, buttonRef);
    const { triggerProps, tooltipProps } = useTooltip({
      triggerRef: buttonRef,
      anchorRef: buttonRef,
    });

    return (
      <>
        <motion.button ref={buttonRef} {...mergeProps(htmlProps, buttonProps, triggerProps)}>
          {children}
        </motion.button>

        <Tooltip {...tooltipProps}>{tooltipContent}</Tooltip>
      </>
    );
  },
);

export const IconButton = styled(IconButtonBase)`
  padding: var(--spacing-2);
  display: flex;

  color: var(--color-fg-0);
  background-color: transparent;
  border: none;
  border-radius: 50%;
  font-size: ${({ size }) =>
    size === 'small' ? 'var(--icon-size-small)' : 'var(--icon-size-medium)'};

  &:not(:disabled) {
    cursor: pointer;
  }

  &:not(:disabled):hover {
    border-color: var(--color-bg-2);
    background-color: var(--color-bg-2);
  }

  &:not(:disabled):active {
    background-color: var(--color-bg-3);
  }

  /* transition taken from @mui/material <Button> component, with duration reduced from 250ms to 150ms */
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;
