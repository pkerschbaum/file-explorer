import * as React from 'react';
import { Paper, Table, TableContainer } from '@mui/material';
import { css } from '@emotion/react';

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
    <Stack
      aria-label={labels?.container}
      direction="column"
      spacing={0}
      css={css`
        height: 100%;
        max-height: 100%;
        min-height: 0;
        overflow-x: auto;
      `}
    >
      <TableContainer
        css={[
          commonStyles.flex.shrinkAndFitVertical,
          css`
            flex-basis: ${!applyIntrinsicHeight ? 0 : 'auto'};
          `,
        ]}
        className={classesFromProps?.tableContainer}
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
      </TableContainer>
      {footer}
    </Stack>
  );
};
