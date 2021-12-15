import useForkRef from '@mui/utils/useForkRef';
import { mergeProps } from '@react-aria/utils';
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

    const combinedRef = useForkRef(null, ref);

    return (
      <DataTableRoot
        {...mergeProps(delegatedProps, {
          className: classes?.table,
          'aria-label': labels?.table,
        })}
        ref={combinedRef}
      >
        <TableContainer ref={refs?.tableContainer}>
          <StyledTable>{children}</StyledTable>
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
  overflow-x: auto;
`;

const TableContainer = styled(Box)`
  width: 100%;
  ${commonStyles.layout.flex.shrinkAndFitVertical}
`;

const StyledTable = styled.table`
  border-spacing: 0px;
`;
