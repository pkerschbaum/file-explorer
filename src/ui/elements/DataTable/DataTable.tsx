import { Box, Paper, Table, TableContainer } from '@mui/material';
import * as React from 'react';
import styled from 'styled-components';

import { commonStyles } from '@app/ui/Common.styles';
import { EmptyRow } from '@app/ui/elements/DataTable/EmptyRow';
import { TableBody } from '@app/ui/elements/DataTable/TableBody';

export type DataTableProps = {
  renderNoDataPresentMessage?: boolean;
  labels?: { container?: string; table?: string };
  classes?: { tableContainer?: string; table?: string };
  refs?: { tableContainer?: React.RefObject<HTMLDivElement> };
  applyIntrinsicHeight?: boolean;

  children: null | React.ReactNode;
  footer?: React.ReactNode;
};

export const DataTable: React.FC<DataTableProps> = (props) => {
  const {
    renderNoDataPresentMessage,
    labels,
    classes: classesFromProps,
    refs,
    applyIntrinsicHeight,
    children,
    footer,
  } = props;

  return (
    <DataTableWrapper aria-label={labels?.container}>
      <StyledTableContainer
        ref={refs?.tableContainer}
        className={classesFromProps?.tableContainer}
        sx={{ flexBasis: !applyIntrinsicHeight ? 0 : 'auto' }}
        component={Paper}
        variant="outlined"
      >
        <Table
          aria-label={labels?.table}
          className={classesFromProps?.table}
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

const DataTableWrapper = styled(Box)`
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow-x: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTableContainer: typeof TableContainer = styled(TableContainer)`
  ${commonStyles.layout.flex.shrinkAndFitVertical}

  /* material-ui TableContainer does use the "Paper" material-ui component, but this component 
     does bring it's own background-color. 
     We don't want any background-color to be set for DataTables, so reset it. */
  background-color: initial;
`;
