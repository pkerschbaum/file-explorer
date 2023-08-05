import * as React from 'react';
import styled from 'styled-components';

import {
  Box,
  IconButton,
  Paper,
  Popover,
  SettingsIcon,
  usePopover,
} from '#pkg/ui/components-library';
import { PREFERENCES_BUTTON_WIDTH, ROOTCONTAINER_PADDING_FACTOR } from '#pkg/ui/shell/constants';
import { UserPreferencesArea } from '#pkg/ui/user-preferences/UserPreferencesArea';

type UserPreferencesButtonProps = {};

export const UserPreferencesButton: React.FC<UserPreferencesButtonProps> = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const { triggerProps, popoverInstance } = usePopover({
    triggerRef: buttonRef,
  });

  const label = !popoverInstance.state.isOpen ? 'Open User Preferences' : '';

  return (
    <>
      <UserPreferencesButtonContainer>
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

const UserPreferencesButtonContainer = styled(Box)`
  position: absolute;

  top: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));
  right: calc(${ROOTCONTAINER_PADDING_FACTOR} * var(--spacing-1));

  width: ${PREFERENCES_BUTTON_WIDTH}px;
`;
