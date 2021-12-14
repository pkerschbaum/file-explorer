import * as React from 'react';
import styled from 'styled-components';

export type TableBodyProps = TableBodyComponentProps &
  Omit<
    React.ComponentPropsWithoutRef<'tbody'> & React.RefAttributes<HTMLTableSectionElement>,
    keyof TableBodyComponentProps
  >;

type TableBodyComponentProps = {};

const TableBodyBase = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBodyBaseWithRef(props, ref) {
    const { children, ...delegatedProps } = props;

    return (
      <tbody {...delegatedProps} ref={ref}>
        {children}
      </tbody>
    );
  },
);

export const TableBody = styled(TableBodyBase)``;
