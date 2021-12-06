import SettingsIcon from '@mui/icons-material/Settings';
import * as React from 'react';
import styled from 'styled-components';

import { Box, IconButton, Tooltip, useTooltip } from '@app/ui/components-library';

export const USER_PREFERENCES_BUTTON_GRID_AREA = 'shell-app-settings-button';

type UserPreferencesButtonProps = {
  userPreferencesSidebarOpen: boolean;
  setUserPreferencesSidebarOpen: (open: boolean) => void;
};

export const UserPreferencesButton: React.FC<UserPreferencesButtonProps> = ({
  userPreferencesSidebarOpen,
  setUserPreferencesSidebarOpen,
}) => {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { triggerProps, tooltipProps } = useTooltip({ triggerRef, anchorRef: triggerRef });

  return (
    <UserPreferencesButtonContainer>
      <IconButton
        ref={triggerRef}
        size="medium"
        {...(triggerProps as any)}
        onClick={(e) => {
          setUserPreferencesSidebarOpen(!userPreferencesSidebarOpen);
          if (triggerProps.onClick) {
            triggerProps.onClick(e);
          }
        }}
      >
        <SettingsIcon fontSize="inherit" />
      </IconButton>

      <Tooltip {...tooltipProps}>
        {!userPreferencesSidebarOpen ? 'Open User Preferences' : 'Hide User Preferences'}
      </Tooltip>
    </UserPreferencesButtonContainer>
  );
};

const UserPreferencesButtonContainer = styled(Box)`
  grid-area: ${USER_PREFERENCES_BUTTON_GRID_AREA};

  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;
