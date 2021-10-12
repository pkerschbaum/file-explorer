import * as React from 'react';
import { TableCell, TableRow } from '@mui/material';

import { Stack } from '@app/ui/layouts/Stack';
import { ROW_HEIGHT } from '@app/ui/elements/DataTable/Row';

export const EmptyRow: React.FC = () => {
  return (
    <TableRow style={{ height: ROW_HEIGHT }} tabIndex={-1}>
      <TableCell colSpan={999}>
        <Stack justifyContent="center">
          <strong>No data present</strong>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
