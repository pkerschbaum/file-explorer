import { Box, Divider, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import * as React from 'react';

import styled from 'styled-components';

import { useActiveTheme } from '@app/global-state/slices/user.hooks';
import { setActiveTheme } from '@app/operations/user-preferences.operations';
import { availableThemes, AvailableTheme } from '@app/ui/ThemeProvider';

export const USER_PREFERENCES_SIDEBAR_GRID_AREA = 'shell-user-preferences-sidebar';

type UserPreferencesSidebarProps = {
  userPreferencesSidebarOpen: boolean;
};

export const UserPreferencesSidebar: React.FC<UserPreferencesSidebarProps> = ({
  userPreferencesSidebarOpen,
}) => {
  const activeTheme = useActiveTheme();

  return (
    <Container variant="outlined" userPreferencesSidebarOpen={userPreferencesSidebarOpen}>
      <PreferenceGroup>
        <PreferenceLabel>Theme</PreferenceLabel>

        <ToggleButtonGroup
          color="primary"
          value={activeTheme}
          exclusive
          onChange={(_1, newActiveTheme: AvailableTheme | null) => {
            if (newActiveTheme) {
              setActiveTheme(newActiveTheme);
            }
          }}
        >
          {availableThemes.map((availableTheme) => (
            <ToggleButton key={availableTheme} value={availableTheme}>
              {availableTheme}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </PreferenceGroup>

      <Divider />
    </Container>
  );
};

const Container = styled(Paper)<{ userPreferencesSidebarOpen: boolean }>`
  grid-area: ${USER_PREFERENCES_SIDEBAR_GRID_AREA};
  padding-inline: ${({ theme }) => theme.spacing()};
  padding-block: ${({ theme }) => theme.spacing(1.5)};

  display: ${({ userPreferencesSidebarOpen }) => (userPreferencesSidebarOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

const PreferenceGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing()};
`;

const PreferenceLabel = styled(Box)`
  font-size: ${({ theme }) => theme.font.sizes.sm};
  font-weight: ${({ theme }) => theme.font.weights.bold};
  text-transform: uppercase;
`;
