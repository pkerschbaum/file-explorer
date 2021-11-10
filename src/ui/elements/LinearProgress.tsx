// taken from: https://material-ui.com/components/progress/#linear-with-label
import {
  Box,
  LinearProgress as MuiLinearProgress,
  LinearProgressProps as MuiLinearProgressProps,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';

import { check } from '@app/base/utils/assert.util';
import { TextBox } from '@app/ui/elements/TextBox';
import { Stack } from '@app/ui/layouts/Stack';

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
    <Stack spacing={1.5}>
      {!prefersReducedMotion ? (
        <MuiLinearProgress
          value={value}
          {...otherProps}
          variant={variant}
          sx={{ flexGrow: 1, ...otherProps.sx }}
        />
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <TextBox fontSize="sm" sx={{ textTransform: 'uppercase' }}>
            In Progress...
          </TextBox>
        </Box>
      )}
      {variant === 'determinate' && check.isNotNullish(value) && (
        <Box>
          <TextBox fontSize="sm" sx={{ color: 'textSecondary' }}>{`${Math.round(value)}%`}</TextBox>
        </Box>
      )}
    </Stack>
  );
};
