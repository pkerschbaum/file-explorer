import * as React from 'react';
import styled from 'styled-components';

import { commonStyles } from '@app/ui/common-styles';
import { Box } from '@app/ui/components-library/Box';

export type DataTableProps = DataTableComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof DataTableComponentProps
  >;

type DataTableComponentProps = {
  labels?: { table?: string };
  classes?: { table?: string };
  refs?: { tableContainer?: React.RefObject<HTMLDivElement> };
};

export const DataTable = styled(
  React.forwardRef<HTMLDivElement, DataTableProps>(function DataTableWithRef(props, ref) {
    const {
      /* component props */
      children,
      labels,
      classes,
      refs,

      /* other props */
      ...delegatedProps
    } = props;

    return (
      <DataTableRoot {...delegatedProps} ref={ref}>
        <TableContainer ref={refs?.tableContainer}>
          <StyledTable aria-label={labels?.table} className={classes?.table}>
            {children}
          </StyledTable>
        </TableContainer>
      </DataTableRoot>
    );
  }),
)``;

const DataTableRoot = styled(Box)`
  min-height: 0;
  height: 100%;
  max-height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TableContainer = styled(Box)`
  width: 100%;
  ${commonStyles.layout.flex.shrinkAndFitVertical}

  overflow-x: auto;

  border: var(--border-width-1) solid var(--color-darken-1);
  border-radius: var(--border-radius-2);
`;

const StyledTable = styled.table`
  width: 100%;
  /* create stacking context for sticky header cells */
  isolation: isolate;

  border-spacing: 0px;
`;
