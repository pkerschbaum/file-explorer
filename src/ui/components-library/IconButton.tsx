import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { Tooltip, TooltipProps, useTooltip } from '@app/ui/components-library/Tooltip';

type IconButtonProps = IconButtonAriaProps &
  IconButtonComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'> & React.RefAttributes<HTMLButtonElement>,
    keyof IconButtonAriaProps | keyof IconButtonComponentProps
  >;

type IconButtonAriaProps = Pick<AriaButtonProps<'button'>, 'children' | 'onPress' | 'isDisabled'>;

type IconButtonComponentProps = {
  tooltipContent: React.ReactChild;
  tooltipPlacement?: TooltipProps<any>['placement'];
  size?: 'medium' | 'small';
  disablePadding?: boolean;
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
      tooltipPlacement,
      size,
      disablePadding,

      /* other props */
      ...delegatedProps
    } = props;
    const reactAriaProps: AriaButtonProps<'button'> = {
      children,
      onPress,
      isDisabled,
    };

    const buttonRef = useObjectRef(ref);
    const { buttonProps } = useButton(reactAriaProps, buttonRef);
    const { triggerProps, tooltipInstance } = useTooltip({
      triggerRef: buttonRef,
      anchorRef: buttonRef,
    });

    return (
      <>
        <motion.button ref={buttonRef} {...mergeProps(delegatedProps, buttonProps, triggerProps)}>
          <FocusAndHoverCircle disablePadding={disablePadding} size={size} />
          <ButtonContent>{children}</ButtonContent>
        </motion.button>

        <Tooltip
          tooltipInstance={tooltipInstance}
          placement={tooltipPlacement}
          offset={{ mainAxis: !disablePadding ? undefined : 17 }}
        >
          {tooltipContent}
        </Tooltip>
      </>
    );
  },
);

export const IconButton = styled(IconButtonBase)`
  position: relative;
  isolation: isolate;

  display: flex;
  ${({ disablePadding, size }) =>
    disablePadding
      ? css`
          padding: 0;
        `
      : size === 'small'
      ? css`
          padding: var(--spacing-1);
        `
      : css`
          padding: var(--spacing-2);
        `}

  color: var(--color-fg-0);
  background-color: transparent;
  border: none;
  ${({ size }) =>
    size === 'small'
      ? css`
          font-size: var(--icon-size-small);
        `
      : css`
          font-size: var(--icon-size-medium);
        `};

  &:not(:disabled) {
    cursor: pointer;
  }
`;

const ButtonContent = styled(Box)`
  position: relative;
  display: flex;
`;

const FocusAndHoverCircle = styled(Box)<{ disablePadding?: boolean; size?: 'medium' | 'small' }>`
  position: absolute;
  ${({ disablePadding, size }) =>
    !disablePadding
      ? css`
          inset: 0;
        `
      : size === 'small'
      ? css`
          inset: calc(-1 * var(--spacing-1));
        `
      : css`
          inset: calc(-1 * var(--spacing-2));
        `}

  border-radius: 50%;
  /* transition taken from @mui/material <Button> component, with duration reduced from 250ms to 150ms */
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  ${IconButton}:focus-visible > & {
    outline: var(--outline);
  }

  ${IconButton}:not(:disabled):hover > & {
    border-color: var(--color-bg-2);
    background-color: var(--color-bg-2);
  }

  ${IconButton}:not(:disabled):active > & {
    background-color: var(--color-bg-3);
  }
`;
