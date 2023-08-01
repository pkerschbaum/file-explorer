import * as React from 'react';
import styled, { css } from 'styled-components';

import {
  Box,
  IconButton,
  Paper,
  Popover,
  SettingsIcon,
  usePopover,
} from '#pkg/ui/components-library';
import {
  PREFERENCES_BUTTON_WIDTH,
  ROOTCONTAINER_PADDING_FACTOR,
  TITLEBAR_HEIGHT,
} from '#pkg/ui/shell/constants';
import { UserPreferencesArea } from '#pkg/ui/user-preferences/UserPreferencesArea';

type UserPreferencesButtonProps = {
  customTitleBarUsed: boolean;
};

export const UserPreferencesButton: React.FC<UserPreferencesButtonProps> = ({
  customTitleBarUsed,
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const { triggerProps, popoverInstance } = usePopover({
    triggerRef: buttonRef,
  });

  const label = !popoverInstance.state.isOpen ? 'Open User Preferences' : '';

  return (
    <>
      <UserPreferencesButtonContainer styleProps={{ customTitleBarUsed }}>
        <IconButton
          ref={buttonRef}
          aria-label={label}
          tooltipContent={label}
          onPress={() => popoverInstance.state.open()}
          ariaButtonProps={triggerProps}
        >
          <SettingsIcon />
        </IconButton>
      </UserPreferencesButtonContainer>

      <Popover popoverInstance={popoverInstance}>
        <Paper>
          <UserPreferencesArea />
        </Paper>
      </Popover>
    </>
  );
};

type StyleProps = {
  customTitleBarUsed: boolean;
};

const UserPreferencesButtonContainer = styled(Box)<{ styleProps: StyleProps }>`
  position: absolute;

  /* If a custom title bar is used, overlap the CwdBreadcrumbs with the WindowDragRegion above it */
  ${({ styleProps }) =>
    styleProps.customTitleBarUsed
      ? css`
          top: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1) + ${TITLEBAR_HEIGHT}px);
        `
      : css`
          top: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
        `}
  right: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));

  width: ${PREFERENCES_BUTTON_WIDTH}px;
`;
