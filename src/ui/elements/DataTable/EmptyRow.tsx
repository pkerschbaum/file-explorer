import { TableCell, TableRow } from '@mui/material';
import * as React from 'react';

import { Stack } from '@app/ui/layouts/Stack';

export const EmptyRow: React.FC = () => {
  return (
    <TableRow tabIndex={-1}>
      <TableCell colSpan={999}>
        <Stack justifyContent="center">
          <strong>No data present</strong>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
