import * as React from 'react';
import styled from 'styled-components';

export type TableBodyProps = TableBodyComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'tbody'> & React.RefAttributes<HTMLTableSectionElement>,
    keyof TableBodyComponentProps
  >;

type TableBodyComponentProps = {};

export const TableBody = styled(
  React.forwardRef<HTMLTableSectionElement, TableBodyProps>(function TableBodyWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <TableBodyRoot {...delegatedProps} ref={ref}>
        {children}
      </TableBodyRoot>
    );
  }),
)``;

const TableBodyRoot = styled.tbody``;
