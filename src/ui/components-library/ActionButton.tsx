import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { Button, ButtonProps, ButtonTypeMap, ExtendButtonBase, useMediaQuery } from '@mui/material';
// @ts-expect-error -- we have to import from /node here because jest would otherwise import the ESM module (which Jest cannot handle)
import TouchRipple from '@mui/material/node/ButtonBase/TouchRipple';
import { motion } from 'framer-motion';
import * as React from 'react';
import styled from 'styled-components';
import invariant from 'tiny-invariant';

import { MUI_BUTTON_SPACING_FACTOR } from '@app/ui/components-library/Theme';

type ActionButtonProps = ButtonProps<
  typeof motion.button,
  {
    StartIconComponent?: typeof ContentCopyOutlinedIcon;
    disableLayoutAnimation?: boolean;
  }
>;

export type ActionButtonRef = {
  triggerSyntheticClick: () => void;
};

type TouchRippleRef = {
  start: (e: MouseEvent) => void;
  stop: (e: MouseEvent) => void;
};

export const ActionButton = React.forwardRef<ActionButtonRef, ActionButtonProps>(
  function ActionButtonWithRef(
    { children, StartIconComponent, endIcon, onClick, disableLayoutAnimation, ...delegated },
    ref,
  ) {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const touchRippleRef = React.useRef<TouchRippleRef>(null);

    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    React.useImperativeHandle(
      ref,
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
      [],
    );

    disableLayoutAnimation = prefersReducedMotion || disableLayoutAnimation;

    return (
      <StyledButton
        ref={buttonRef}
        component={motion.button}
        layout={!disableLayoutAnimation}
        startIcon={
          StartIconComponent && (
            <ActionButtonAnimatedIcon layout={!disableLayoutAnimation}>
              <StartIconComponent
                fontSize="inherit"
                component={motion.svg}
                layout={!disableLayoutAnimation}
              />
            </ActionButtonAnimatedIcon>
          )
        }
        endIconPresent={!!endIcon}
        endIcon={
          <ActionButtonAnimatedIcon layout={!disableLayoutAnimation}>
            {endIcon}
          </ActionButtonAnimatedIcon>
        }
        onClick={onClick}
        {...delegated}
      >
        <TouchRipple ref={touchRippleRef} center={false} />
        <ActionButtonContent layout={!disableLayoutAnimation}>{children}</ActionButtonContent>
      </StyledButton>
    );
  },
);

const ActionButtonAnimatedIcon = styled(motion.span)`
  display: flex;
  align-items: stretch;
`;

const ActionButtonContent = styled(motion.span)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing()};
`;

type StyledButtonProps = { endIconPresent: boolean };

const StyledButton: ExtendButtonBase<ButtonTypeMap<StyledButtonProps>> = styled(
  Button,
)<StyledButtonProps>`
  & > .MuiButton-endIcon {
    /* If no endIcon is present, we revert the gap introduced by the surrounding flexbox container. 
     * We cannot just remove the endIcon (via display: none or conditional rendering) because then 
     * we would not have any framer-motion layout animation for the endIcon. */
    margin-left: ${(props) =>
      !props.endIconPresent ? props.theme.spacing(-MUI_BUTTON_SPACING_FACTOR) : 0};
  }
`;
