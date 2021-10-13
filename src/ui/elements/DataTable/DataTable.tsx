import * as React from 'react';
import { Paper, Table, TableContainer } from '@mui/material';
import styled from '@mui/styled-engine';

import { Stack } from '@app/ui/layouts/Stack';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';
import { EmptyRow } from '@app/ui/elements/DataTable/EmptyRow';
import { commonStyles } from '@app/ui/Common.styles';

type DataTableProps = {
  renderNoDataPresentMessage?: boolean;
  labels?: { container?: string };
  classes?: { tableContainer?: string };
  applyIntrinsicHeight?: boolean;

  children: null | React.ReactNode[];
  footer?: React.ReactNode;
};

export const DataTable: React.FC<DataTableProps> = (props) => {
  const {
    renderNoDataPresentMessage,
    labels,
    classes: classesFromProps,
    applyIntrinsicHeight,
    children,
    footer,
  } = props;

  return (
    <DataTableWrapper aria-label={labels?.container} direction="column" spacing={0}>
      <StyledTableContainer
        className={classesFromProps?.tableContainer}
        sx={{ flexBasis: !applyIntrinsicHeight ? 0 : 'auto' }}
        component={Paper}
        variant="outlined"
      >
        <Table
          stickyHeader
          size="small"
          style={{ height: renderNoDataPresentMessage ? '100%' : undefined }}
        >
          {children}
          {renderNoDataPresentMessage && (
            <TableBody>
              <EmptyRow />
            </TableBody>
          )}
        </Table>
      </StyledTableContainer>
      {footer}
    </DataTableWrapper>
  );
};

const DataTableWrapper = styled(Stack)`
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow-x: auto;
`;

const StyledTableContainer: typeof TableContainer = styled(TableContainer)`
  ${commonStyles.flex.shrinkAndFitVertical}
`;
