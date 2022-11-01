import * as React from 'react';
import styled from 'styled-components';

import { AvailableFileIconTheme, FILE_ICON_THEMES } from '@app/domain/constants';
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

export const UserPreferencesArea: React.FC = () => {
  const activeTheme = useActiveTheme();
  const activeFileIconTheme = useActiveFileIconTheme();

  return (
    <Container>
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
    </Container>
  );
};

const Container = styled(Paper)`
  padding: var(--spacing-4);

  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const StyledRadio = styled(Radio)`
  text-transform: capitalize;
`;
