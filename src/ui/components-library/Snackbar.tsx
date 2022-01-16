import * as React from 'react';
import styled, { css } from 'styled-components';

import { assertIsUnreachable, check } from '@app/base/utils/assert.util';
import { Box } from '@app/ui/components-library/Box';
import { Button } from '@app/ui/components-library/Button';
import { useFramerMotionAnimations } from '@app/ui/components-library/DesignTokenContext';
import { ErrorOutlineOutlinedIcon } from '@app/ui/components-library/icons';

export enum SNACKBAR_SEVERITY {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

type SnackbarProps = {
  severity: SNACKBAR_SEVERITY;
  label: string;
  detail?: string;
  actions?: SnackbarAction[];
};

export type SnackbarAction = {
  label: string;
  onPress: () => void;
};

export const Snackbar: React.FC<SnackbarProps> = ({ severity, label, detail, actions }) => {
  const framerMotionAnimations = useFramerMotionAnimations();

  return (
    <SnackbarContainer {...framerMotionAnimations.fadeInOut}>
      <IconContainer styleProps={{ severity }}>
        {severity === SNACKBAR_SEVERITY.ERROR && <ErrorOutlineOutlinedIcon fontSize="sm" />}
      </IconContainer>
      <Label>
        {label}
        {check.isNonEmptyString(detail) && ':'}
      </Label>
      {check.isNonEmptyString(detail) && <Detail>{detail}</Detail>}

      {actions && (
        <Actions>
          {actions.map((action, idx) => (
            <Button key={idx} variant="text" onPress={action.onPress}>
              {action.label}
            </Button>
          ))}
        </Actions>
      )}
    </SnackbarContainer>
  );
};

const SnackbarContainer = styled(Box)`
  position: fixed;
  right: var(--spacing-6);
  bottom: var(--spacing-6);

  max-width: 500px;
  padding: var(--spacing-3);
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: max-content max-content max-content;
  grid-template-areas:
    'icon label'
    'empty detail'
    'actions actions';
  align-items: center;
  gap: var(--spacing-2);

  background-color: var(--color-bg-1);
  border-radius: var(--border-radius-1);
`;

type StyleProps = {
  severity: SNACKBAR_SEVERITY;
};

const IconContainer = styled(Box)<{ styleProps: StyleProps }>`
  grid-area: icon;

  display: flex;
  ${({ styleProps }) =>
    styleProps.severity === SNACKBAR_SEVERITY.ERROR
      ? css`
          color: var(--color-error);
        `
      : styleProps.severity === SNACKBAR_SEVERITY.WARNING
      ? css`
          color: var(--color-warning);
        `
      : assertIsUnreachable(styleProps.severity)}
`;

const Label = styled(Box)`
  grid-area: label;
`;

const Detail = styled(Box)`
  grid-area: detail;

  max-height: 200px;
  padding: var(--spacing-1) var(--spacing-2);
  overflow-y: auto;

  border: var(--border-width-1) solid var(--color-darken-1);
  border-radius: var(--border-radius-2);
`;

const Actions = styled(Box)`
  grid-area: actions;

  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
`;
