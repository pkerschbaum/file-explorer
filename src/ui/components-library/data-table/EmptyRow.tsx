import { TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { Box } from '@app/ui/components-library/Box';

export const EmptyRow: React.FC = () => {
  return (
    <TableRow tabIndex={-1}>
      <TableCell colSpan={999}>
        <RowContent>
          <strong>No data present</strong>
        </RowContent>
      </TableCell>
    </TableRow>
  );
};

const RowContent = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
