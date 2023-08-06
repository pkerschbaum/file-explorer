import * as React from 'react';
import { styled } from 'styled-components';

export type TableHeadProps = TableHeadComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'thead'> & React.RefAttributes<HTMLTableSectionElement>,
    keyof TableHeadComponentProps
  >;

type TableHeadComponentProps = {};

export const TableHead = styled(
  React.forwardRef<HTMLTableSectionElement, TableHeadProps>(function TableHeadWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <TableHeadRoot {...delegatedProps} ref={ref}>
        {children}
      </TableHeadRoot>
    );
  }),
)``;

const TableHeadRoot = styled.thead``;
