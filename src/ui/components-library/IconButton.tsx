import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '@app/ui/components-library/Box';
import { DESIGN_TOKENS } from '@app/ui/components-library/DesignTokenProvider';
import { Placement, Tooltip, useTooltip } from '@app/ui/components-library/Tooltip';

type IconButtonProps = IconButtonAriaProps &
  IconButtonComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'> & React.RefAttributes<HTMLButtonElement>,
    keyof IconButtonAriaProps | keyof IconButtonComponentProps
  >;

type IconButtonAriaProps = Required<Pick<AriaButtonProps<'button'>, 'aria-label'>> &
  Pick<AriaButtonProps<'button'>, 'children' | 'onPress' | 'isDisabled'>;

type IconButtonComponentProps = {
  tooltipContent: React.ReactChild;
  tooltipPlacement?: Placement;
  size?: 'md' | 'sm';
  disablePadding?: boolean;
};

export const IconButton = styled(
  React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButtonWithRef(props, ref) {
    const {
      /* react-aria props */
      'aria-label': ariaLabel,
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
      'aria-label': ariaLabel,
      children,
      onPress,
      isDisabled,
    };

    const buttonRef = useObjectRef(ref);
    const { buttonProps } = useButton(reactAriaProps, buttonRef);

    let iconButtonPadding;
    if (size === 'sm') {
      iconButtonPadding = DESIGN_TOKENS.SPACING_1_5;
    } else {
      iconButtonPadding = DESIGN_TOKENS.SPACING_2;
    }

    /**
     * The IconButton has a rounded shape with some padding. If focused, the IconButton gets a outline
     * with a width of DESIGN_TOKENS.OUTLINE_WIDTH pixels.
     *
     * We want the arrow of the tooltip to point on that outline while not overlapping it.
     * That's why we set a offset for the tooltip which equals the padding plus the outline width.
     *
     * If the padding is disabled, the IconButton's rounded box does not take up any space (but it
     * still shows on hover/focus). In that case, we have to add an additional offset, otherwise the
     * Tooltip would leak into the rounded box.
     */
    let tooltipOffsetToUse = iconButtonPadding + DESIGN_TOKENS.OUTLINE_WIDTH;
    if (disablePadding) {
      tooltipOffsetToUse += DESIGN_TOKENS.SPACING_2;
    }
    const { triggerProps, tooltipInstance } = useTooltip({
      triggerRef: buttonRef,
      tooltip: {
        placement: tooltipPlacement,
        offset: {
          mainAxis: tooltipOffsetToUse,
        },
      },
    });

    const styleProps: StyleProps = {
      ...props,
      iconButtonPadding,
    };

    return (
      <>
        <IconButtonRoot
          ref={buttonRef}
          {...mergeProps(delegatedProps, buttonProps, triggerProps)}
          styleProps={styleProps}
        >
          <FocusAndHoverCircle styleProps={styleProps} />
          <ButtonContent>{children}</ButtonContent>
        </IconButtonRoot>

        {tooltipInstance.state.isOpen && (
          <Tooltip tooltipInstance={tooltipInstance}>{tooltipContent}</Tooltip>
        )}
      </>
    );
  }),
)``;

type StyleProps = IconButtonProps & {
  iconButtonPadding: number;
};

const IconButtonRoot = styled(motion.button)<{ styleProps: StyleProps }>`
  position: relative;
  isolation: isolate;

  display: flex;
  ${({ styleProps: scProps }) =>
    css`
      --icon-button-padding: ${scProps.iconButtonPadding}px;
    `}
  ${({ styleProps: scProps }) =>
    scProps.disablePadding
      ? css`
          padding: 0;
        `
      : css`
          padding: var(--icon-button-padding);
        `}

  color: var(--color-fg-0);
  background-color: transparent;
  border: none;
  ${({ styleProps: scProps }) =>
    scProps.size === 'sm'
      ? css`
          font-size: var(--icon-size-sm);
        `
      : css`
          font-size: var(--icon-size-md);
        `};

  &:not(:disabled) {
    cursor: pointer;
  }
`;

const ButtonContent = styled(Box)`
  position: relative;
  display: flex;
`;

const FocusAndHoverCircle = styled(Box)<{ styleProps: StyleProps }>`
  position: absolute;
  ${({ styleProps }) =>
    !styleProps.disablePadding
      ? css`
          inset: 0;
        `
      : css`
          inset: calc(-1 * var(--icon-button-padding));
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
