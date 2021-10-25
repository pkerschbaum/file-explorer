import * as React from 'react';
import { TableCell, TableRow } from '@mui/material';

import { Stack } from '@app/ui/layouts/Stack';

export const EmptyRow: React.FC = () => {
  return (
    <TableRow sx={{ height: (theme) => theme.sizes.fileRow.height }} tabIndex={-1}>
      <TableCell colSpan={999}>
        <Stack justifyContent="center">
          <strong>No data present</strong>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
