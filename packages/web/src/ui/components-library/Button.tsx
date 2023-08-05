import { useButton } from '@react-aria/button';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import type { AriaButtonProps } from '@react-types/button';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled, { css } from 'styled-components';
import invariant from 'tiny-invariant';

import { Box } from '#pkg/ui/components-library/Box';
import { Paper } from '#pkg/ui/components-library/Paper';
import type { ReactMotionProps } from '#pkg/ui/components-library/utils';
import { componentLibraryUtils } from '#pkg/ui/components-library/utils';

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
  enableLayoutAnimation?: boolean | 'size' | 'position';
};

export type ButtonHandle = {
  triggerSyntheticPress: () => void;
};

export const Button = styled(
  React.forwardRef<HTMLButtonElement, ButtonProps>(function ButtonWithRef(props, ref) {
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
    const touchRippleHandleRef = React.useRef<TouchRippleHandle>(null);

    // @ts-expect-error -- when using the "triggerSyntheticPress" function, react-aria useButton does sometimes set the focus on the synthetically pressed button. This is not the intended behavior - the button should just get triggered without changing the focus. The undocumented prop "preventFocusOnPress" does disable the focus behavior of react-aria.
    reactAriaProps.preventFocusOnPress = true;
    const { buttonProps } = useButton(reactAriaProps, buttonRef);

    const isAnimationAllowed = componentLibraryUtils.useIsAnimationAllowed();

    React.useImperativeHandle(
      handleRef,
      () => ({
        triggerSyntheticPress: () => {
          invariant(buttonRef.current);
          invariant(touchRippleHandleRef.current);

          if (buttonRef.current.disabled || buttonRef.current.ariaDisabled === 'true') {
            return;
          }

          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          buttonRef.current.dispatchEvent(clickEvent);

          // Trigger touch ripple animation
          touchRippleHandleRef.current.trigger();
        },
      }),
      [buttonRef],
    );

    const animateLayout = isAnimationAllowed && enableLayoutAnimation;

    return (
      <ButtonRoot
        {...mergeProps(delegatedProps, buttonProps)}
        ref={buttonRef}
        layout={animateLayout}
        styleProps={props}
      >
        <ButtonIcon layout={animateLayout} startIconIsPresent={!!startIcon}>
          {startIcon}
        </ButtonIcon>

        {children && <ButtonContent layout={animateLayout}>{children}</ButtonContent>}

        <ButtonIcon layout={animateLayout} endIconIsPresent={!!endIcon}>
          {endIcon}
        </ButtonIcon>
        <TouchRipple handleRef={touchRippleHandleRef} />
      </ButtonRoot>
    );
  }),
)``;

type StyleProps = ButtonProps;

const variantRules = css<{ styleProps: StyleProps }>`
  ${({ styleProps }) => {
    if (styleProps.variant === 'contained') {
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
    } else if (styleProps.variant === 'text') {
      return css`
        color: var(--color-primary-main);
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

const ButtonRoot = styled(
  /**
   * Override motion.button type definition because it "onAnimationStart" of framer-motion conflicts with "onAnimationStart" of @types/react
   */
  motion.button as React.FC<ReactMotionProps<'button', HTMLButtonElement>>,
)<{ styleProps: StyleProps }>`
  min-width: 45px;

  /* 
     set "position: relative" and "overflow: hidden" so that 
     1) the button is a container for the absolutely positioned TouchRipple,
     2) and the ripple animation does not leak out of the container.
   */
  position: relative;
  overflow: hidden;

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

  ${({ styleProps }) => {
    return styleProps.buttonSize === 'sm'
      ? css`
          padding: 0 6px;
          font-size: var(--font-size-sm);
        `
      : css`
          padding: var(--padding-button-md-block) var(--padding-button-md-inline);
        `;
  }}


  &:focus-visible:not(:active) {
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

type TouchRippleProps = {
  handleRef?: React.RefObject<TouchRippleHandle>;
};

type TouchRippleHandle = {
  trigger: () => void;
};

const TouchRipple: React.FC<TouchRippleProps> = ({ handleRef }) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useImperativeHandle(
    handleRef,
    () => ({
      trigger: () => setIsAnimating(true),
    }),
    [],
  );

  return (
    <TouchRippleSpan
      styleProps={{ animating: isAnimating }}
      onAnimationEnd={() => setIsAnimating(false)}
    />
  );
};

type TouchRippleStyleProps = { animating: boolean };

// taken from https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/#react
const TouchRippleSpan = styled.span<{ styleProps: TouchRippleStyleProps }>`
  position: absolute;
  height: calc(3 * 1em);
  width: calc(3 * 1em);

  border-radius: 50%;
  background-color: var(--color-darken-3);
  transform: scale(0);

  ${({ styleProps }) =>
    styleProps.animating &&
    css`
      animation: var(--animation-ripple);
    `}
`;
