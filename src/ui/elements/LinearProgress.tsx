// taken from: https://material-ui.com/components/progress/#linear-with-label
import {
  Box,
  LinearProgress as MuiLinearProgress,
  LinearProgressProps as MuiLinearProgressProps,
} from '@mui/material';
import * as React from 'react';

import { TextBox } from '@app/ui/elements/TextBox';
import { Stack } from '@app/ui/layouts/Stack';

type LinearProgressProps = MuiLinearProgressProps & {
  value: number;
};

export const LinearProgress: React.FC<LinearProgressProps> = ({ value, ...otherProps }) => {
  const variant = otherProps.variant ?? 'determinate';

  return (
    <Stack spacing={1.5}>
      <MuiLinearProgress
        value={value}
        {...otherProps}
        variant={variant}
        sx={{ width: '100%', ...otherProps.sx }}
      />
      {variant === 'determinate' && (
        <Box>
          <TextBox fontSize="sm" sx={{ color: 'textSecondary' }}>{`${Math.round(value)}%`}</TextBox>
        </Box>
      )}
    </Stack>
  );
};
