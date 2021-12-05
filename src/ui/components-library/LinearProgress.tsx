// taken from: https://material-ui.com/components/progress/#linear-with-label
import {
  Box,
  LinearProgress as MuiLinearProgress,
  LinearProgressProps as MuiLinearProgressProps,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { check } from '@app/base/utils/assert.util';

type LinearProgressProps = MuiLinearProgressProps & {
  value?: number;
};

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value,
  variant = 'determinate',
  ...otherProps
}) => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <LinearProgressContainer>
      {!prefersReducedMotion ? (
        <MuiLinearProgress
          value={value}
          {...otherProps}
          variant={variant}
          sx={{ flexGrow: 1, ...otherProps.sx }}
        />
      ) : (
        <Box sx={{ flexGrow: 1, textTransform: 'uppercase' }}>In Progress...</Box>
      )}
      {variant === 'determinate' && check.isNotNullish(value) && (
        <Box>{`${Math.round(value)}%`}</Box>
      )}
    </LinearProgressContainer>
  );
};

const LinearProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
`;
