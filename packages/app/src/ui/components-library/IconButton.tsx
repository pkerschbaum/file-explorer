import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { AriaButtonProps } from '@react-types/button';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { Box } from '#pkg/ui/components-library/Box';
import { DESIGN_TOKENS } from '#pkg/ui/components-library/DesignTokenContext';
import type { Placement } from '#pkg/ui/components-library/Tooltip';
import { Tooltip, useTooltip } from '#pkg/ui/components-library/Tooltip';
import type { ReactMotionProps } from '#pkg/ui/components-library/utils';

type IconButtonProps = IconButtonAriaProps &
  IconButtonComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'> & React.RefAttributes<HTMLButtonElement>,
    keyof IconButtonAriaProps | keyof IconButtonComponentProps
  >;

type IconButtonAriaProps = Required<Pick<AriaButtonProps<'button'>, 'aria-label'>> &
  Pick<AriaButtonProps<'button'>, 'children' | 'onPress' | 'isDisabled'> & {
    ariaButtonProps?: AriaButtonProps<'button'>;
  };

type IconButtonComponentProps = {
  tooltipContent: React.ReactChild;
  tooltipPlacement?: Placement;
  tooltipOverrideIsOpen?: boolean;
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
      ariaButtonProps: delegatedAriaButtonProps,

      /* component props */
      tooltipContent,
      tooltipPlacement,
      tooltipOverrideIsOpen,
      size,
      disablePadding,

      /* other props */
      ...delegatedProps
    } = props;
    const reactAriaProps: AriaButtonProps<'button'> = mergeProps(
      {
        'aria-label': ariaLabel,
        children,
        onPress,
        isDisabled,
      },
      delegatedAriaButtonProps ?? {},
    );

    const buttonRef = useObjectRef(ref);
    const { buttonProps } = useButton(reactAriaProps, buttonRef);

    const iconButtonPadding = size === 'sm' ? DESIGN_TOKENS.SPACING_1_5 : DESIGN_TOKENS.SPACING_2;

    /**
     * The IconButton has a rounded shape with some padding. If focused, the IconButton gets a outline
     * with a width of DESIGN_TOKENS.OUTLINE_WIDTH pixels.
     *
     * We want the arrow of the tooltip to point on that outline while not overlapping it.
     * That's why we set a offset for the tooltip which equals the padding plus the outline width.
     *
     * If the padding is disabled, we have to add a little bit of padding so that the Tooltip does not
     * intersect with the outline of the IconButton.
     */
    let tooltipOffsetToUse = iconButtonPadding + DESIGN_TOKENS.OUTLINE_WIDTH;
    if (disablePadding) {
      tooltipOffsetToUse += 3;
    }
    const { triggerProps, tooltipInstance } = useTooltip({
      triggerRef: buttonRef,
      tooltip: {
        isOpen: tooltipOverrideIsOpen,
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

        {tooltipContent && (
          <Tooltip tooltipInstance={tooltipInstance} overrideIsOpen={tooltipOverrideIsOpen}>
            {tooltipContent}
          </Tooltip>
        )}
      </>
    );
  }),
)``;

type StyleProps = IconButtonProps & {
  iconButtonPadding: number;
};

const IconButtonRoot = styled(
  /**
   * Override motion.button type definition because it "onAnimationStart" of framer-motion conflicts with "onAnimationStart" of @types/react
   */
  motion.button as React.FC<ReactMotionProps<'button', HTMLButtonElement>>,
)<{ styleProps: StyleProps }>`
  position: relative;

  display: flex;
  ${({ styleProps: scProps }) =>
    css`
      --icon-button-padding: ${scProps.iconButtonPadding}px;
    `}
  padding: var(--icon-button-padding);
  ${({ styleProps: scProps }) =>
    scProps.disablePadding &&
    css`
      /* if the padding is disabled (i.e. it should not take up any space), undo padding via negative margin */
      margin: calc(-1 * var(--icon-button-padding));
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
  pointer-events: none;
  position: relative;
  display: flex;
`;

const FocusAndHoverCircle = styled(Box)<{ styleProps: StyleProps }>`
  pointer-events: none;
  position: absolute;
  inset: 0;

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
