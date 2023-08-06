import * as React from 'react';
import { styled } from 'styled-components';

import { commonStyles } from '#pkg/ui/common-styles';
import { Box } from '#pkg/ui/components-library/Box';

export type DataTableProps = DataTableComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'div'> & React.RefAttributes<HTMLDivElement>,
    keyof DataTableComponentProps
  >;

type DataTableComponentProps = {
  labels?: { table?: string };
  classes?: { table?: string };
};

export const DataTable = styled(
  React.forwardRef<HTMLDivElement, DataTableProps>(function DataTableWithRef(props, ref) {
    const {
      /* component props */
      children,
      labels,
      classes,

      /* other props */
      ...delegatedProps
    } = props;

    return (
      <TableContainer {...delegatedProps} ref={ref}>
        <StyledTable aria-label={labels?.table} className={classes?.table}>
          {children}
        </StyledTable>
      </TableContainer>
    );
  }),
)``;

const TableContainer = styled(Box)`
  width: 100%;
  ${commonStyles.layout.flex.shrinkAndFitVertical}

  overflow: auto;

  border: var(--border-width-1) solid var(--color-darken-1);
  border-radius: var(--border-radius-2);
`;

const StyledTable = styled.table`
  width: 100%;
  /* create stacking context for sticky header cells */
  isolation: isolate;

  border-spacing: 0px;
`;
