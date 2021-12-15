import SettingsIcon from '@mui/icons-material/Settings';
import * as React from 'react';
import styled from 'styled-components';

import { Box, Icon, IconButton } from '@app/ui/components-library';

export const USER_PREFERENCES_BUTTON_GRID_AREA = 'shell-app-settings-button';

type UserPreferencesButtonProps = {
  userPreferencesSidebarOpen: boolean;
  setUserPreferencesSidebarOpen: (open: boolean) => void;
};

export const UserPreferencesButton: React.FC<UserPreferencesButtonProps> = ({
  userPreferencesSidebarOpen,
  setUserPreferencesSidebarOpen,
}) => {
  return (
    <UserPreferencesButtonContainer>
      <IconButton
        tooltipContent={
          !userPreferencesSidebarOpen ? 'Open User Preferences' : 'Hide User Preferences'
        }
        onPress={() => {
          setUserPreferencesSidebarOpen(!userPreferencesSidebarOpen);
        }}
      >
        <Icon Component={SettingsIcon} />
      </IconButton>
    </UserPreferencesButtonContainer>
  );
};

const UserPreferencesButtonContainer = styled(Box)`
  grid-area: ${USER_PREFERENCES_BUTTON_GRID_AREA};

  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
`;
