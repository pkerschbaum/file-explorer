import * as React from 'react';
import styled from 'styled-components';

import { AvailableFileIconTheme, FILE_ICON_THEMES } from '@app/constants';
import { useActiveFileIconTheme, useActiveTheme } from '@app/global-state/slices/user.hooks';
import {
  setActiveFileIconTheme,
  setActiveTheme,
} from '@app/operations/user-preferences.operations';
import {
  AvailableTheme,
  availableThemes,
  Divider,
  Paper,
  Radio,
  RadioGroup,
} from '@app/ui/components-library';

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
    <Container userPreferencesSidebarOpen={userPreferencesSidebarOpen}>
      <RadioGroup
        label="Theme"
        value={activeTheme}
        onChange={(newActiveTheme: string) => {
          if (newActiveTheme) {
            setActiveTheme(newActiveTheme as AvailableTheme);
          }
        }}
      >
        {availableThemes.map((availableTheme) => (
          <StyledRadio key={availableTheme} value={availableTheme}>
            {availableTheme}
          </StyledRadio>
        ))}
      </RadioGroup>

      <Divider />

      <RadioGroup
        label="File Icons"
        value={activeFileIconTheme}
        onChange={(newActiveFileIconTheme) => {
          if (newActiveFileIconTheme) {
            setActiveFileIconTheme(newActiveFileIconTheme as AvailableFileIconTheme);
          }
        }}
      >
        {Object.entries(FILE_ICON_THEMES).map(([id, availableFileIconTheme]) => (
          <StyledRadio key={id} value={id}>
            {availableFileIconTheme.label}
          </StyledRadio>
        ))}
      </RadioGroup>

      <Divider />
    </Container>
  );
};

const Container = styled(Paper)<{ userPreferencesSidebarOpen: boolean }>`
  grid-area: ${USER_PREFERENCES_SIDEBAR_GRID_AREA};
  padding: var(--spacing-4);

  display: ${({ userPreferencesSidebarOpen }) => (userPreferencesSidebarOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: var(--spacing-4);
`;

const StyledRadio = styled(Radio)`
  text-transform: capitalize;
`;
