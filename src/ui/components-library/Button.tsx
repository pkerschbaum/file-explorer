// @ts-expect-error -- we have to import from /node here because jest would otherwise import the ESM module (which Jest cannot handle)
import TouchRipple from '@mui/material/node/ButtonBase/TouchRipple';
import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import useMediaMatch from '@rooks/use-media-match';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';
import invariant from 'tiny-invariant';

import { Box } from '@app/ui/components-library/Box';
import { Paper } from '@app/ui/components-library/Paper';

type ButtonProps = ButtonAriaProps &
  ButtonComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'> & React.RefAttributes<HTMLButtonElement>,
    keyof ButtonAriaProps | keyof ButtonComponentProps
  >;

type ButtonAriaProps = Pick<
  AriaButtonProps<'button'>,
  'children' | 'onPress' | 'onKeyDown' | 'isDisabled' | 'type'
> & {
  ariaButtonProps?: AriaButtonProps<'button'>;
};

type ButtonComponentProps = {
  variant?: 'outlined' | 'contained' | 'text';
  buttonSize?: 'md' | 'sm';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  handleRef?: React.RefObject<ButtonHandle>;
  enableLayoutAnimation?: boolean;
};

export type ButtonHandle = {
  triggerSyntheticPress: () => void;
};

type TouchRippleRef = {
  start: (e: MouseEvent) => void;
  stop: (e: MouseEvent) => void;
};

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(function ButtonBaseWithRef(
  props,
  ref,
) {
  const {
    /* react-aria props */
    children,
    onPress,
    onKeyDown,
    isDisabled,
    type,
    ariaButtonProps: delegatedAriaButtonProps,

    /* component props */
    variant: _ignored1,
    buttonSize: _ignored2,
    startIcon,
    endIcon,
    handleRef,
    enableLayoutAnimation,

    /* other props */
    ...delegatedProps
  } = props;
  const reactAriaProps: AriaButtonProps<'button'> = mergeProps(
    {
      children,
      onPress,
      onKeyDown,
      isDisabled,
      type,
    },
    delegatedAriaButtonProps ?? {},
  );

  const buttonRef = useObjectRef(ref);
  // @ts-expect-error -- when using the "triggerSyntheticPress" function, react-aria useButton does sometimes set the focus on the synthetically pressed button. This is not the intended behavior - the button should just get triggered without changing the focus. The undocumented prop "preventFocusOnPress" does disable the focus behavior of react-aria.
  reactAriaProps.preventFocusOnPress = true;
  const { buttonProps } = useButton(reactAriaProps, buttonRef);

  const touchRippleRef = React.useRef<TouchRippleRef>(null);

  const prefersReducedMotion = useMediaMatch('(prefers-reduced-motion: reduce)');

  React.useImperativeHandle(
    handleRef,
    () => ({
      triggerSyntheticPress: () => {
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

  const animateLayout = enableLayoutAnimation && !prefersReducedMotion;

  return (
    <motion.button
      {...mergeProps(delegatedProps, buttonProps)}
      ref={buttonRef}
      layout={animateLayout}
    >
      <ButtonIcon layout={animateLayout} startIconIsPresent={!!startIcon}>
        {startIcon}
      </ButtonIcon>

      {children && <ButtonContent layout={animateLayout}>{children}</ButtonContent>}

      <ButtonIcon layout={animateLayout} endIconIsPresent={!!endIcon}>
        {endIcon}
      </ButtonIcon>
      <TouchRipple ref={touchRippleRef} center={false} />
    </motion.button>
  );
});

const variantRules = css<{ variant?: 'outlined' | 'contained' | 'text' }>`
  ${({ variant }) => {
    if (variant === 'contained') {
      return css`
        color: var(--color-primary-contrast);
        background-color: var(--color-primary-main);
        border-color: var(--color-primary-contrast);
        border-width: 1px;
        font-weight: var(--font-weight-bold);

        &:disabled {
          color: var(--color-darken-2);
          background-color: var(--color-bg-1);
          border-color: var(--color-darken-0);
        }

        &:not(:disabled):hover {
          border-color: var(--color-primary-dark-1);
          background-color: var(--color-primary-dark-1);
        }

        &:not(:disabled):active {
          filter: brightness(70%);
        }
      `;
    } else if (variant === 'text') {
      return css`
        color: var(--color-fg-0);
        background-color: transparent;
        border-width: 0;

        &:disabled {
          color: var(--color-darken-2);
          background-color: var(--color-bg-1);
          border-color: var(--color-darken-0);
        }

        &:not(:disabled):hover {
          border-color: var(--color-bg-2);
          background-color: var(--color-bg-2);
        }

        &:not(:disabled):active {
          background-color: var(--color-bg-3);
        }
      `;
    } else {
      return css`
        color: var(--color-fg-0);
        background-color: var(--color-bg-1);
        border-color: var(--color-bg-1);
        border-width: 1px;

        &:disabled {
          color: var(--color-darken-2);
          background-color: var(--color-bg-1);
          border-color: var(--color-darken-0);
        }

        &:not(:disabled):hover {
          border-color: var(--color-bg-2);
          background-color: var(--color-bg-2);
        }

        &:not(:disabled):active {
          filter: brightness(70%);
        }

        /* if a standard ("outlined") Button is inside of a Paper, we have to bump the background color up by 1 level */
        ${Paper} && {
          background-color: var(--color-bg-2);

          &:not(:disabled):hover {
            background-color: var(--color-bg-3);
          }
        }
      `;
    }
  }}
`;

export const Button = styled(ButtonBase)`
  min-width: 45px;

  /* set position to relative so that the button is a container for the absolutely positioned TouchRipple */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: var(--border-radius-2);
  border-style: solid;
  /* transition taken from @mui/material <Button> component, with duration reduced from 250ms to 150ms */
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
    color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  ${variantRules}

  ${({ buttonSize }) => {
    if (buttonSize === 'sm') {
      return css`
        padding: 0 6px;
        font-size: var(--font-size-sm);
      `;
    } else {
      return css`
        padding: var(--padding-button-md-block) var(--padding-button-md-inline);
      `;
    }
  }}


  &:focus-visible {
    outline: var(--outline);
  }

  &:not(:disabled) {
    cursor: pointer;
  }
`;

const ButtonContent = styled(Box)`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
`;

const ButtonIcon = styled(Box)<{ startIconIsPresent?: boolean; endIconIsPresent?: boolean }>`
  padding-right: ${({ startIconIsPresent }) => !!startIconIsPresent && 'var(--spacing-2)'};
  padding-left: ${({ endIconIsPresent }) => !!endIconIsPresent && 'var(--spacing-2)'};
  display: flex;
  align-items: center;
`;
