// taken from: https://material-ui.com/components/progress/#linear-with-label
import * as React from 'react';
import {
  Box,
  LinearProgress as MuiLinearProgress,
  LinearProgressProps as MuiLinearProgressProps,
} from '@mui/material';

import { Stack } from '@app/ui/layouts/Stack';
import { TextBox } from '@app/ui/elements/TextBox';

type LinearProgressProps = MuiLinearProgressProps & {
  value: number;
};

export const LinearProgress: React.FC<LinearProgressProps> = ({ value, ...otherProps }) => {
  const variant = otherProps.variant ?? 'determinate';

  return (
    <Stack>
      <MuiLinearProgress
        value={value}
        {...otherProps}
        variant={variant}
        sx={{ width: '100%', ...otherProps.sx }}
      />
      {variant === 'determinate' && (
        <Box sx={{ minWidth: 35 }}>
          <TextBox fontSize="sm" sx={{ color: 'textSecondary' }}>{`${Math.round(value)}%`}</TextBox>
        </Box>
      )}
    </Stack>
  );
};
