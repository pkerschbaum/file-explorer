import { Box, Divider, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import * as React from 'react';

import styled from 'styled-components';

import { AvailableFileIconTheme, FILE_ICON_THEMES } from '@app/constants';
import { useActiveFileIconTheme, useActiveTheme } from '@app/global-state/slices/user.hooks';
import {
  setActiveFileIconTheme,
  setActiveTheme,
} from '@app/operations/user-preferences.operations';
import { availableThemes, AvailableTheme } from '@app/ui/ThemeProvider';

export const USER_PREFERENCES_SIDEBAR_GRID_AREA = 'shell-user-preferences-sidebar';

type UserPreferencesSidebarProps = {
  userPreferencesSidebarOpen: boolean;
};

export const UserPreferencesSidebar: React.FC<UserPreferencesSidebarProps> = ({
  userPreferencesSidebarOpen,
}) => {
  const activeTheme = useActiveTheme();
  const activeFileIconTheme = useActiveFileIconTheme();

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

      <PreferenceGroup>
        <PreferenceLabel>File Icons</PreferenceLabel>

        <ToggleButtonGroup
          color="primary"
          value={activeFileIconTheme}
          exclusive
          onChange={(_1, newActiveFileIconTheme: AvailableFileIconTheme | null) => {
            if (newActiveFileIconTheme) {
              setActiveFileIconTheme(newActiveFileIconTheme);
            }
          }}
        >
          {Object.entries(FILE_ICON_THEMES).map(([id, availableFileIconTheme]) => (
            <ToggleButton key={id} value={id as AvailableFileIconTheme}>
              {availableFileIconTheme.label}
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
  font-weight: ${({ theme }) => theme.font.weights.bold};
  text-transform: uppercase;
`;
