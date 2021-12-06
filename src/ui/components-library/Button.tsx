import { useMediaQuery } from '@mui/material';
// @ts-expect-error -- we have to import from /node here because jest would otherwise import the ESM module (which Jest cannot handle)
import TouchRipple from '@mui/material/node/ButtonBase/TouchRipple';
import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';
import invariant from 'tiny-invariant';

type ButtonProps = AriaButtonProps<'button'> &
  Pick<React.HTMLProps<HTMLButtonElement>, 'tabIndex' | 'style'> & {
    variant?: 'outlined' | 'contained' | 'text';
    buttonSize?: 'md' | 'sm';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    handleRef?: React.RefObject<ButtonHandle>;
    enableLayoutAnimation?: boolean;
  };

export type ButtonHandle = {
  triggerSyntheticClick: () => void;
};

type TouchRippleRef = {
  start: (e: MouseEvent) => void;
  stop: (e: MouseEvent) => void;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function ButtonWithRef(
  props,
  ref,
) {
  const { children, startIcon, endIcon, handleRef, enableLayoutAnimation } = props;

  const buttonRef = useObjectRef(ref);
  const { buttonProps } = useButton(props, buttonRef);

  const touchRippleRef = React.useRef<TouchRippleRef>(null);

  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  React.useImperativeHandle(
    handleRef,
    () => ({
      triggerSyntheticClick: () => {
        invariant(buttonRef.current);

        if (buttonRef.current.disabled || buttonRef.current.ariaDisabled === 'true') {
          return;
        }

        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        buttonRef.current.dispatchEvent(clickEvent);

        touchRippleRef.current?.start(clickEvent);
        setTimeout(() => {
          touchRippleRef.current?.stop(clickEvent);
        }, 200);
      },
    }),
    [buttonRef],
  );

  const layoutAnimation = enableLayoutAnimation && !prefersReducedMotion;

  return (
    <StyledButton
      ref={buttonRef}
      {...mergeProps(props, buttonProps)}
      componentProps={props}
      layout={layoutAnimation}
    >
      <ButtonIcon layout={layoutAnimation}>{startIcon}</ButtonIcon>

      {children && <ButtonContent layout={layoutAnimation}>{children}</ButtonContent>}

      <ButtonIcon layout={layoutAnimation}>{endIcon}</ButtonIcon>
      <TouchRipple ref={touchRippleRef} center={false} />
    </StyledButton>
  );
});

const StyledButton = styled(motion.button)<{ componentProps: ButtonProps }>`
  /* set position to relative so that the button is a container for the absolutely positioned TouchRipple */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-2);

  border-radius: var(--border-radius-2);
  border-style: solid;

  ${({ componentProps }) => {
    if (componentProps === 'sm') {
      return css`
        padding-block: 0;
        padding-inline: 6px;
        font-size: var(--font-size-sm);
      `;
    } else {
      return css`
        padding-block: 5px;
        padding-inline: 10px;
      `;
    }
  }}

  ${({ componentProps }) => {
    if (componentProps.variant === 'contained') {
      return css`
        color: var(--color-primary-contrast);
        background-color: var(--color-primary-main);

        border-width: 1px;
        border-color: var(--color-primary-contrast);

        font-weight: var(--font-weight-bold);
      `;
    } else if (componentProps.variant === 'text') {
      return css`
        color: var(--color-fg-0);

        border-width: 0;
      `;
    } else {
      return css`
        color: var(--color-fg-0);
        background-color: var(--color-bg-1);

        border-width: 1px;
        border-color: var(--color-bg-1);
      `;
    }
  }}

  &:not(:disabled) {
    cursor: pointer;
  }

  &:not(:disabled):hover {
    ${({ componentProps }) => {
      if (componentProps.variant === 'contained') {
        return css`
          border-color: var(--color-primary-dark);
          background-color: var(--color-primary-dark);
        `;
      } else {
        return css`
          border-color: var(--color-bg-2);
          background-color: var(--color-bg-2);
        `;
      }
    }}
  }

  &:not(:disabled):active {
    filter: brightness(70%);
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.12);
  }

  &:focus-visible {
    outline: 2px solid var(--color-outline);
  }

  /* transition taken from @mui/material <Button> component, with duration reduced from 250ms to 150ms */
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const ButtonContent = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const ButtonIcon = styled(motion.div)`
  display: flex;
  align-items: center;
`;
